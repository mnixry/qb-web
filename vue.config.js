module.exports = {
  outputDir: 'dist/public',

  lintOnSave:false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://10.10.10.5:38800',
        // target: 'http://10.1.1.5:38800',
        ws: true,
        changeOrigin: true,
    }
    }
  }
}
