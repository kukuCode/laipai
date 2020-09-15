module.exports = {
  devServer: {
    port:3000,
    hot: true,
    clientLogLevel: 'warning',
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/api': {
          target: 'http://192.168.2.90:8088', // 内网
          // target: 'http://47.108.156.173', // 外网
          ws: false,
          changeOrigin: true
      }
  }
  }
}
