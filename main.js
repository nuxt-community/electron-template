/*
**  Nuxt.js part
*/
let win = null

const Nuxt = require('nuxt')
const server = require('express')()

// Import and Set Nuxt.js options
let config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)
server.use(nuxt.render)

// Build only in dev mode
if (config.dev) {
  nuxt.build()
  .catch((error) => {
    console.error(error) // eslint-disable-line no-console
    process.exit(1)
  })
}

// Listen the server
server.listen(3000, '127.0.0.1')
console.log('Server listening on localhost:3000')

/*
** Electron app
*/
const electron = require('electron')
const path = require('path')
const url = require('url')

const http = require('http')
const POLL_INTERVAL = 300
const pollServer = () => {
  http.get('http://localhost:3000', (res) => {
    const SERVER_DOWN = res.statusCode !== 200
    SERVER_DOWN ? setTimeout(pollServer, POLL_INTERVAL) : win.loadURL('http://localhost:3000')
  })
  .on('error', pollServer)
}

const app = electron.app
const bw = electron.BrowserWindow

const newWin = () => {
  win = new bw({ width: 1024, height: 768 })
  if (!config.dev) {
    return win.loadURL('http://localhost:3000')
  }
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  win.on('closed', () => win = null)
  pollServer()
}

app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())
