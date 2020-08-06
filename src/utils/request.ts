import Taro from '@tarojs/taro';
import { getUserStorage } from './user';
import { log } from '.';
import { apiTypes } from 'src/apis';

interface OptionalRequestParams extends Partial<Taro.RequestParams> {
  url: apiTypes;
}

type PartialRequestParams = Partial<Taro.RequestParams>;

type CustomConfig = {
  host?: string;
};

interface CustomRequestParams extends Taro.RequestParams {
  [key: string]: any;
}

type requestInterceptor = {
  resolved: (config) => Promise<CustomRequestParams>;
  reject?: (error) => Promise<Error>;
};

type responseInterceptor = {
  resolved: (res) => Promise<any>;
  reject?: (error) => Promise<Error>;
};

type interceptor = requestInterceptor | responseInterceptor;

class TaroRequest {
  defaultTaroRequestConfig: PartialRequestParams;

  customConfig: CustomConfig;

  promiseChain: interceptor[];

  constructor(config?: PartialRequestParams) {
    this.defaultTaroRequestConfig = {
      ...{
        dataType: 'json',
        responseType: 'text',
        header: {},
        timeout: 10000
      },
      ...config
    };
    this.promiseChain = [
      {
        resolved: this.request
      }
    ];
    this.customConfig = {};
  }

  request = async (preConfig) => {
    // 如果自带http或https开头，则不做host处理。因为没有租户化，无需用ext.json文件里的配置
    let realUrl = this.customConfig.host + preConfig.url;
    if (/^https?/.test(preConfig.url)) {
      realUrl = preConfig.url;
    }
    try {
      return await Taro.request({
        ...preConfig,
        url: realUrl
      });
    } catch (error) {
      return new Error(error.errMsg);
    }
  };

  run = async <T>(config) => {
    console.log(config)
    const copyPromiseChain = this.promiseChain.slice();
    let promise: Promise<T | Taro.RequestParams> = Promise.resolve(config);
    while (copyPromiseChain.length) {
      const { resolved, reject } = copyPromiseChain.shift() as interceptor;
      promise = promise.then(resolved, reject);
    }
    return promise;
  };

  post = async <T>(params: apiTypes | OptionalRequestParams, data?: any) => {
    const config: Taro.RequestParams = {
      ...this.defaultTaroRequestConfig,
      ...(typeof params === 'string' ? { url: params, data } : params),
      method: 'POST'
    };
    return this.run<T>(config);
  };

  get = async <T>(params: apiTypes | OptionalRequestParams, data?: any) => {
    const config: Taro.RequestParams = {
      ...this.defaultTaroRequestConfig,
      ...(typeof params === 'string' ? { url: params, data } : params),
      method: 'GET'
    };
    return this.run<T>(config);
  };

  put = async <T>(params: apiTypes | OptionalRequestParams, data?: any) => {
    const config: Taro.RequestParams = {
      ...this.defaultTaroRequestConfig,
      ...(typeof params === 'string' ? { url: params, data } : params),
      method: 'PUT'
    };
    return this.run<T>(config);
  };

  requestInterceptor = (
    resolved: (config: Taro.RequestParams) => Promise<CustomRequestParams>,
    reject?: (error) => Promise<Error>
  ) => {
    this.promiseChain.unshift({
      resolved,
      reject
    });
  };

  responseInterceptor = (
    resolved: (res: Taro.request.SuccessCallbackResult) => Promise<any>,
    reject?: (error) => Promise<Error>
  ) => {
    this.promiseChain.push({
      resolved,
      reject
    });
  };
}

const TaroRequestInstance = new TaroRequest({
  header: {
    'x-application-type': '1',
    'x-application-version': '1.1.2',
    'x-terminal-type': '1',
    'content-type': 'application/json'
  }
});

/* 请求拦截器 */
TaroRequestInstance.requestInterceptor(async function(config) {
  // 处理host
  if (TaroRequestInstance.customConfig.host === undefined) {
    const { extConfig } = await Taro.getExtConfig();
    log('extConfig配置内容', extConfig, 'blue');
    // 如果是非第三方平台的小程序，这里获取不到extConfig的，目前开发第一个版本，由于后端登录接口没有租户化，无法登录，因此使用的是牛牛搭小程序的appid（非三方平台小程序）
    // 这里先用牛牛搭的接口，也就是||后面的部分，跑通原业务。
    TaroRequestInstance.customConfig.host = extConfig.host || HOST;
    // 通过自定义header区分租户
    if (TaroRequestInstance.defaultTaroRequestConfig.header) {
      TaroRequestInstance.defaultTaroRequestConfig.header['x-tenant-prefix'] =
        extConfig.tenant || TENANT;
    }
  }
  if (TaroRequestInstance.defaultTaroRequestConfig.header) {
    if (
      !TaroRequestInstance.defaultTaroRequestConfig.header['x-access-token'] ||
      !TaroRequestInstance.defaultTaroRequestConfig.header['x-user-id']
    ) {
      // 初始化去获取token，userId，添加自定义请求头
      try {
        const { token, userId } = await getUserStorage();
        if (token) {
          TaroRequestInstance.defaultTaroRequestConfig.header['x-access-token'] = token;
        }
        if (userId) {
          TaroRequestInstance.defaultTaroRequestConfig.header['x-user-id'] = userId;
        }
      } catch (error) {
        log('缺少token', error, 'red');
      }
    }
  }
  return Promise.resolve(config);
});

/* 响应拦截器 */
// 这块基于实际业务接口，处理res

const SUCCESS = '10000';
const AUTH_EXPIRED = '-10040';
const NOT_LOGIN = '-10010';

interface apiDataType {
  code: typeof SUCCESS | typeof AUTH_EXPIRED | typeof NOT_LOGIN;
  result: any;
  success: boolean;
  error: null | string;
}

// res可能是报错，如果接口502了，这里res就是个[object Error]
function handleRes(res: Taro.request.SuccessCallbackResult<apiDataType>) {
  const { errMsg, statusCode, data } = res;
  // 判断Taro.request是否正常
  if (errMsg !== 'request:ok' || statusCode !== 200) {
    return Promise.reject(new Error(errMsg || '网络异常请重试'));
  }

  // 判断业务接口状态
  const { code, result, success, error } = data;
  if (code === SUCCESS && success) {
    return result || {}; // 默认返回有数据的东西
  } else {
    return Promise.reject(new Error(`${code}: ${error}` || '接口调用出错'));
  }
}

TaroRequestInstance.responseInterceptor(handleRes, err => {
  return Promise.reject(err);
});

export default TaroRequestInstance;
