const isDev = process.env.NODE_ENV === 'DEV'
const path = require('path')
/*
**  Nuxt
*/

const { fork } = require('child_process');

const forked = fork(path.join(__dirname,'./nuxtService.js'));

/*
** Electron
*/

forked.on('message',(message)=>{
    
    if( message.status != 'done')
        return

    const _NUXT_URL_ = `http://localhost:${message.port}`

    if(isDev)
	    console.log(`Nuxt working on ${_NUXT_URL_}`)

	let win = null // Current window
    const { app, BrowserWindow } = require('electron')

    const createWindow  = async () => {
        win = new BrowserWindow({
            width: 800,
            height: 600,
            webSecurity: false,

			// uncommect for node integration

            //webPreferences:{
            //    nodeIntegration: true,
            //    contextIsolation: false,
            //    enableRemoteModule: true,
            //}
        })
    
        if(isDev)
        {
            // Install vue dev tool and open chrome dev tools
            const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')
            
			await installExtension(VUEJS_DEVTOOLS,{
                loadExtensionOptions: {
                    allowFileAccess: true,
                }
            })
            win.webContents.openDevTools()
            win.maximize()

            //Load Content
            await  win.loadURL(_NUXT_URL_)
        }
        else 
            return win.loadURL(_NUXT_URL_)
    }

    app.whenReady().then(async () => {

        await createWindow()

        // If in macOS, Open a window when there are none
        app.on('activate', function () {
        	if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    })

    //If not in macOS, Quit Application when all windows are closed
    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit()
    })
})
