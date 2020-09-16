const CONFIG = {
    // 开发环境配置
    development: {
        assetsPath: '/static', // 静态资源路径
        // baseUrl: 'http://47.108.156.173/api', // 后台接口请求地址
        baseUrl: 'http://localhost:3000/api', // 后台接口请求地址
        // baseUrl: 'http://demo.rageframe.com/api', // 后台接口请求地址
        hostUrl: 'http://h5.laipai.com', // H5地址(前端运行地址)
        websocketUrl: '', // websocket服务端地址
        weixinAppId: 'wx2fcbcf5a4b93f8ae', // 微信appid
        weixinSecretId: '44ec1b1e8db5cd0ab0c940871058ec27' ,// 微信Secretid
    },
    // 生产环境配置
    production: {
        assetsPath: '/static', // 静态资源路径
        baseUrl: 'http://47.108.156.173/api', // 后台接口请求地址
        hostUrl: 'http://h5.laipai.com', // H5地址(前端运行地址)
        websocketUrl: '', // websocket服务端地址
        weixinAppId: 'wx2fcbcf5a4b93f8ae', // 微信appid
        weixinSecretId: '44ec1b1e8db5cd0ab0c940871058ec27' // 微信Secretid
    }

};
export default CONFIG[process.env.NODE_ENV];
