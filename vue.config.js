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
          target: 'http://laipai.as.com:8090', // 外网
          ws: false,
          changeOrigin: true
      }
  }
  }
}
