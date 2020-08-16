## 中环来拍

### 前言

前端基于 uni-app，一端发布多端通用，目前已经适配 H5、微信小程序、Ios App、Android App。



### 安装说明

1、安装相关依赖, 默认已拥有node环境

```
// 安装yarn命令
npm i -g yarn
// 安装依赖
yarn
```

2. 运行到指定平台

```
// 运行到H5
yarn serve
// 运行至对应的小程序平台
yarn dev:PLATFORM
```

值 | 平台
---|---
h5 | H5
mp-weixin | 微信小程序
mp-alipay | 支付宝小程序
mp-baidu | 百度小程序
mp-toutiao | 头条小程序
mp-qq | qq 小程序


3. 打包至线上部署
```
// H5打包
yarn build
yarn build:PLATFORM // 平台信息同上
```
使用对应的小程序客户端进行发布。

4、发布uni-app(打包为原生App云端)

配合HBuilderX使用

> 注： H5除主页外刷新页面会出现404 需配置nginx伪静态

```
location / {
    try_files $uri $uri/ /index.html;
}
```

