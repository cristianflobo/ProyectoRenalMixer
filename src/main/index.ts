import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const { SerialPort, ReadlineParser } = require('serialport')
const cron = require('node-cron')
const wifi = require('node-wifi')
import icon from '../../resources/icon.png?asset'
//const { exec } = require('child_process');
import { procesoActualPines, leerProcesoActualPines } from '../renderer/src/utils/metodosGpio/metodosGpio';
import { Twifi } from '../renderer/src/utils/interfaceMain'

type TconexionSerial = {
  puerto:string,
  nombre:string
}

/*/---------------------------------------------------------
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
*/

let serialPortArray: (typeof SerialPort)[] = []
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 500,
    show: false,
    fullscreen:false,
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
  ipcMain.on('conectarSerial', (event, puertos) => {
    //const serialNumberFlujometros:string[] = ['24238313136351902161', '24238313136351F04182']
    //const serialNumberFlujometros:string[] = ['24238313136351706120', '55832343538351F02131']
    async function connectSerialPort(element: TconexionSerial):Promise<void> {
      let serialPort2: typeof SerialPort;
      const bucarPuertoFlujometro = await SerialPort.list();
      console.log(bucarPuertoFlujometro)
      const index = puertos.indexOf(element.puerto);
      if (index !== -1) {
        puertos.splice(index, 1); // Remove the port from the array
      }

      bucarPuertoFlujometro.forEach((item: typeof SerialPort) => {
        if (item.serialNumber === element.puerto) {
          serialPort2 = new SerialPort({
            path: item.path,
            baudRate: 9600,
            autoOpen: false
          });
        }
      });

      try {
        await new Promise<void>((resolve, reject) => {
          serialPort2.open((error: Error | null) => {
            if (error) {
              console.error(`Error al abrir el puerto ${element.puerto}:`, error.message);
              event.reply('menssageFromMain', error.message);
              reject(error);
            } else {
              console.log(`El puerto ${element.puerto} se ha abierto correctamente.`);
              resolve();
            }
          });
        });
        serialPortArray.push(serialPort2);
        const parser = serialPort2.pipe(new ReadlineParser({ delimiter: '\n' }));
        const listenerPortRender = element.nombre;
        parser.on('data', function (data: string) {
          event.reply(`${listenerPortRender}`, data);
          console.log(`${listenerPortRender}`, data);
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log('Error capturado:', error.message);
        } else {
          console.log('Error desconocido capturado:', error);
        }
      }
    }

    puertos.forEach(async (element: TconexionSerial) => {
      await connectSerialPort(element);
    });

  })
  ipcMain.on('desconectarSerial', async () => {
    serialPortArray.forEach(element => {
      element.close((error: string) => {
        return console.log(error)
      })
    });
    serialPortArray = []
  })

  // ipcMain.on('desconectarSerial', async (event, path) => {
  //   const port = serialPortArray.find((item: typeof SerialPort) => item.path === path)
  //   port.close((error: string) => {
  //     return console.log(error)
  //   })
  //   serialPortArray = serialPortArray.filter((item: typeof SerialPort) => item.path !== path)
  //   event.reply('verificarConexionWeb', extractInfoPort(serialPortArray))
  // })

  ipcMain.on('reiniciarFlujometros', async () => {
    const dato = Buffer.from([0])
    try {
      serialPortArray.forEach((element) => {
        element.write(dato)
      })
    } catch (error) {
      console.log(error)
    }
  })
  ipcMain.on('enviarFactorK', async (_event, factorK) => {
    const factorKInt = parseFloat(factorK)
    const dato = Buffer.from([factorKInt])
    try {
      serialPortArray.forEach((element) => {
        element.write(dato)
      })
    } catch (error) {
      console.log(error)
    }
  })
  // ipcMain.on('buscarPuertos', async (_event, _message) => {
  //  // console.log(await SerialPort.list())

  // })
  ipcMain.on('verificarConexionSensoresMain', async (event, _message) => {
    setTimeout(() => {
      event.reply('verificarConexionSensoresRender', serialPortArray.length)
    }, 2000);

  })

//-------------------------------------------------------------wifi
  ipcMain.on('listarWifi', async (event) => {
    wifi.init({
      iface: null
    })
    wifi.scan((error, networks) => {
      if (error) {
        console.log(error)
      } else {
        //console.log(networks);
        event.reply('listaWifi', networks)
      }
    })
  })
  ipcMain.on('conectarWifi', async (event, datos) => {
    wifi.scan((error, networks) => {
      if (error) {
        console.log(error)
      } else {
        const filtrarWifi = networks.find((item: Twifi) => item.ssid === datos.ssid)
        if (filtrarWifi) {
          console.log(filtrarWifi, datos.ssid, datos.contrasena)
          wifi.connect({ ssid: datos.ssid, password: datos.contrasena }, () => {
            console.log('Connected')
            event.reply('conexionCompleta', datos.ssid)
          })
        } else {
          event.reply('conexionCompleta', 'no Connected')
        }
      }
    })
  })

  // const extractInfoPort = (info: typeof SerialPort): void => {
  //   return info.map((item: typeof SerialPort) => {
  //     return { path: item.path, baudRate: item.baudRate }
  //   })
  // }
  //#endregion

  //---------------------------------------------------------------------Tareas programadas cron
  //#region Tareas programadas cron
  //const tareasProgramadas = () => {
  ipcMain.on('configDistribucionDiaria', (_event, data) => {
    if (data.id === 1) {
      cron.schedule(`${data.datos.minu2} ${data.datos.hora1} * * *`, () => {
          procesoActualPines([{nombre:'bomba 3', estado:1}])
          console.log('tarea inicio bomba')
      }, {
        scheduled: true,
        timezone: "America/Bogota"
      });
    }else {
      cron.schedule(`${data.datos.minu2} ${data.datos.hora1} * * *`, () => {
        procesoActualPines([{nombre:'bomba 3', estado:0}])
         console.log('tarea final bomba')
      }, {
      scheduled: true,
      timezone: "America/Bogota"
 });
    }
  })

  //cron.schedule('59 * * * *', () => {
  //console.log('Cron job executed at:', new Date().toLocaleString())
  //})

  //}

  //#endregion

  //---------------------------------------------------------------------LLamado proceso pines
  //#region  proceso pines
  ipcMain.on('procesoPinesSalida', async (_event, message) => {
    procesoActualPines(message)
    console.log(message)
  })
  ipcMain.on('leerPinesSalidaMain', async (event, _message) => {
    leerProcesoActualPines()
    event.reply('leerPinesSalidaRender', leerProcesoActualPines())
  })
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
