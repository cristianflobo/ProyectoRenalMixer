import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const { SerialPort, ReadlineParser } = require('serialport')
const cron = require('node-cron')
import icon from '../../resources/icon.png?asset'
const { exec } = require('child_process');
import { procesoActualPines } from '../renderer/src/utils/metodosGpio/metodosGpio';

//---------------------------------------------------------
exec('sudo hwclock -s -f /dev/rtc1', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error al ejecutar el comando: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
	console.log(new Date())
});
//----------------------------------------------
interface objDataPort {
  path: string
  baudRate: number
}
interface serialPortList {
  friendlyName: string
  manufacturer: string
  path: string
  pnpId: string
  locationId: any
  productId: any
  serialNumber: any
  vendorId: any
}

let serialPortArray: (typeof SerialPort)[] = []
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 500,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  //---------------------------------------------------------------------Componente serial Conexion serial
  //#region Serial
  //let serialport:typeof SerialPort[] = []

  ipcMain.on('buscarPuertos', async (event, _message) => {
    const ports: serialPortList[] = await SerialPort.list()
    if (ports.length > 0) {
      let portConnected = extractInfoPort(serialPortArray)
      let filter = ports.filter(
        (item: serialPortList) =>
          !portConnected.some((item2: serialPortList) => item2.path === item.path)
      )
      event.reply('puertosEncontrados', filter)
    }
  })

  ipcMain.on('conectarSerial', async (event, puerto) => {
    let serialPort = new SerialPort({
      path: puerto.path,
      baudRate: puerto.baud,
      autoOpen: false
    })
    try {
      await new Promise<void>((resolve, reject) => {
        serialPort.open((error: Error | null) => {
          if (error) {
            console.error(`Error al abrir el puerto ${puerto}:`, error.message)
            event.reply('menssageFromMain', error.message)

            reject(error)
          } else {
            console.log(`El puerto ${puerto} se ha abierto correctamente.`)
            resolve()
          }
        })
      })
      serialPortArray.push(serialPort)
      const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }))
      let listenerPortRender = `dataSerial${serialPortArray.length}`
      parser.on('data', function (data: string) {
        event.reply(`${listenerPortRender}`, data)
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Error capturado:', error.message)
      } else {
        console.log('Error desconocido capturado:', error)
      }
    }
  })

  ipcMain.on('verificarConexionMain', async (event) => {
    let listPortInfoSend: objDataPort[] = []
    if (serialPortArray.length > 0) {
      listPortInfoSend = extractInfoPort(serialPortArray)
    }
    event.reply('verificarConexionWeb', listPortInfoSend)
  })

  ipcMain.on('desconectarSerial', async (event, path) => {
    let port = serialPortArray.find((item: typeof SerialPort) => item.path === path)
    port.close((error: string) => {
      return console.log(error)
    })
    serialPortArray = serialPortArray.filter((item: typeof SerialPort) => item.path !== path)
    event.reply('verificarConexionWeb', extractInfoPort(serialPortArray))
  })
  const extractInfoPort = (info: typeof SerialPort) => {
    return info.map((item: typeof SerialPort) => {
      return { path: item.path, baudRate: item.baudRate }
    })
  }
  //#endregion
  
  //---------------------------------------------------------------------Tareas programadas cron
  //#region Tareas programadas cron
  //const tareasProgramadas = () => {

    cron.schedule('3 1 * * *', () => {
      console.log('Cron job executed at:', new Date().toLocaleString())
    })
    //cron.schedule('59 * * * *', () => {
      //console.log('Cron job executed at:', new Date().toLocaleString())
    //})

  //}

  //#endregion
  
  //---------------------------------------------------------------------LLamado proceso pines
  //#region  proceso pines 
  ipcMain.on("procesoPinesSalida", async (_event, message) => {
     procesoActualPines(message)
    console.log(message)
  });
  //#endregion
  createWindow()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
