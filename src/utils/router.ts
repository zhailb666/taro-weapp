import Taro from '@tarojs/taro';
import { stringify } from 'qs';

// 路由跳转
export enum RedirectUrl {
  wishfulHouse = '/pages/wishfulHouse/wishfulHouse', // type = 0 我的收藏
  designerHouse = '/pages/setHouse/pages/designerHouse/designerHouse', // 设计师详情
}

export const redirectTo = (redirectUrl: RedirectUrl, params?: {}) => {
  const url = params ? `${redirectUrl}?${stringify(params)}` : redirectUrl;

  Taro.navigateTo({
    url,
  });
};


export const reload = () => {};

export const goBack = () => {};
