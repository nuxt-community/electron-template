/*
**  Nuxt
*/
let config = require('./nuxt.config.js')
let _NUXT_URL_ = null
const http = require('http')
// Build only in dev mode
if (config.dev) {
	const { Nuxt, Builder } = require('nuxt')
	const nuxt = new Nuxt(config)
	const builder = new Builder(nuxt)
	const server = http.createServer(nuxt.render)
	builder.build().catch(err => {
		console.error(err) // eslint-disable-line no-console
		process.exit(1)
	})
	// Listen the server
	server.listen()
	_NUXT_URL_ = `http://localhost:${server.address().port}`
} else {
	_NUXT_URL_ = `file://${__dirname}/index.html`
}
console.log(`Nuxt working on ${_NUXT_URL_}`)

/*
** Electron
*/
require('electron-debug')({showDevTools: true})
let win = null // Current window
const electron = require('electron')
const path = require('path')
const app = electron.app
const newWin = () => {
	win = new electron.BrowserWindow({
		icon: path.join(__dirname, 'static/icon.png')
	})
	win.maximize()
	win.on('closed', () => win = null)
	if (config.dev) {
		// Install vue dev tool and open chrome dev tools
		const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')
		installExtension(VUEJS_DEVTOOLS.id).catch(err => console.log('An error occurred: ', err))
		// Wait for nuxt to build
		const pollServer = () => {
			http.get(_NUXT_URL_, (res) => {
				if (res.statusCode === 200) { win.loadURL(_NUXT_URL_) } else { setTimeout(pollServer, 300) }
			}).on('error', pollServer)
		}
		pollServer()
	} else { win.loadURL(_NUXT_URL_) }
}
app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())
