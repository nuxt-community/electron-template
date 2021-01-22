const path = require('path')
const http = require('http')
const electron = require('electron')
const { loadNuxt, build } = require('nuxt')

const ROOT_DIR = path.resolve(__dirname)
const NUXT_CONFIG = require('./nuxt.config.js')
const WIN_CONFIG = {
  webPreferences: {
    nodeIntegration: true,
  },
  width: 1000,
  height: 750,
}

const getNuxt = async (isDev) => {
  // Load nuxt with different config for dev and prod
  if (isDev) {
    const nuxt = await loadNuxt({ for: 'dev', rootDir: ROOT_DIR })
    // Build only in dev mode
    await build(nuxt)
    return nuxt
  }
  const nuxt = await loadNuxt({ for: 'start', rootDir: ROOT_DIR })
  return nuxt
}

const startServer = (nuxt) => {
  const server = http.createServer(nuxt.render)
  server.listen()
  const url = `http://localhost:${server.address().port}`
  console.log(`Nuxt working on ${url}`)
  return url
}

const loadFromUrl = (win, url) => {
  http
    .get(url, (res) => {
      if (res.statusCode === 200) {
        win.loadURL(url)
      } else {
        setTimeout(loadFromUrl, 300)
      }
    })
    .on('error', loadFromUrl)
}

const enableDevTools = (win) => {
  const {
    default: installExtension,
    VUEJS_DEVTOOLS,
  } = require('electron-devtools-installer')
  installExtension(VUEJS_DEVTOOLS.id)
    .then((name) => {
      console.log(`Added Extension:  ${name}`)
      win.webContents.openDevTools()
    })
    .catch((err) => console.log('An error occurred: ', err))
}

const createWindow = (isDev) => {
  getNuxt(isDev)
    .then((nuxt) => {
      const url = startServer(nuxt)
      const win = new electron.BrowserWindow(WIN_CONFIG)
      loadFromUrl(win, url)
      if (isDev) {
        enableDevTools(win)
      }
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}

const isDev = NUXT_CONFIG.dev === true
const app = electron.app
app.whenReady().then(() => createWindow(isDev))
app.on('window-all-closed', () => app.quit())
app.on('activate', () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow(isDev)
  }
})
