
# 1. 技术选型 ✅

- react
- mobx
- ts
- sass(taro-ui用的是sass,为了保持一致);


# 2. 整体结构搭建

```
taro-weapp
├── dist                  编译结果目录
├─README.md               
├─babel.config.js
├─global.d.ts
├─list.txt
├─package.json
├─project.config.json
├─tsconfig.json
├─yarn.lock
├── src                    源码目录
|   ├── pages              页面文件目录
|   |   ├ index            index 页面目录
|   |   |   ├── index.js   index 页面逻辑
|   |   |   └── index.scss index 页面样式
|   ├── app.scss           项目总通用样式
|   └── app.js             项目入口文件
├── config                 配置目录
|   ├── dev.js             开发时配置
|   ├── index.js           默认配置
|   └── prod.js            打包时配置
```

# 3. 项目开发



# 4. 项目优化与持续跟踪



# 5. 开发过程中遇到的问题


# 6. 项目中学习的知识点
## taro相关

## mobx相关

## 其他
- https://www.jianshu.com/p/e38a07f824a2
- 生成目录结构命令 treer -i "/.git|node_modules|dist|pages|.vscode|(^\.)/" /f>list.txt






