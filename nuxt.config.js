module.exports = {
  /*
  ** Electron Settings
  */
  electron: {
    width: 1024,
    height: 768
  },
  build: {
    extend (config, { isClient }) {
      // Extend only webpack config for client-bundle
      if (isClient) {
        config.target = 'electron-renderer'
      }
    }
  }
}
