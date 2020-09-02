module.exports = {
  devServer: {
    hot: true,
    clientLogLevel: 'warning',
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/api': {
          target: 'http://47.108.156.173', // 外网
          ws: false,
          changeOrigin: true
      }
  }
  }
}
