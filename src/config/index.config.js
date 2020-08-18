const CONFIG = {
    // 开发环境配置
    development: {
        assetsPath: '/static', // 静态资源路径
        baseUrl: 'http://47.108.156.173', // 后台接口请求地址
        // baseUrl: 'http://demo.rageframe.com/api', // 后台接口请求地址
        hostUrl: 'http://h5.tinyshop.rageframe.com', // H5地址(前端运行地址)
        websocketUrl: '', // websocket服务端地址
        weixinAppId: 'wxeff8e2f58174efa0', // 微信appid
        weixinSecretId: 'd76bde00c5048828982fe5bfae54bcb3' // 微信Secretid
    },
    // 生产环境配置
    production: {
        assetsPath: '/static', // 静态资源路径
        baseUrl: 'http://demo.rageframe.com/api', // 后台接口请求地址
        hostUrl: 'http://h5.tinyshop.rageframe.com', // H5地址(前端运行地址)
        websocketUrl: '', // websocket服务端地址
        weixinAppId: '', // 微信appid
        weixinSecretId: '' // 微信Secretid
    }

};
export default CONFIG[process.env.NODE_ENV];
