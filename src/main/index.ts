import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const { SerialPort, ReadlineParser } = require('serialport')
const cron = require('node-cron')
const wifi = require('node-wifi')
import icon from '../../resources/icon.png?asset'
//const { exec } = require('child_process');
import { procesoActualPines, leerProcesoActualPines } from '../renderer/src/utils/metodosGpio/metodosGpio';
import { Twifi } from './Interfaces/interfaceMain'

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
    fullscreen:true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {icon}),
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

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  //#region Puerto serial
  ipcMain.on('conectarSerial', (event, puertos) => {
    //const serialNumberFlujometros:string[] = ['24238313136351902161', '24238313136351F04182']
    //const serialNumberFlujometros:string[] = ['24238313136351706120', '55832343538351F02131']
    async function connectSerialPort(element: TconexionSerial):Promise<void> {
      let serialPortAuxArray: typeof SerialPort;
      const bucarPuertoFlujometro = await SerialPort.list();
      const index = puertos.indexOf(element.puerto);
      if (index !== -1) {
        puertos.splice(index, 1); // Remove the port from the array
      }

      bucarPuertoFlujometro.forEach((item: typeof SerialPort) => {
        if (item.serialNumber === element.puerto) {
          serialPortAuxArray = new SerialPort({
            path: item.path,
          // path: 'COM5',
            baudRate: 9600,
            autoOpen: false
          });
        }
      });

      try {
        await new Promise<void>((resolve, reject) => {
          serialPortAuxArray.open((error: Error | null) => {
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
        serialPortArray.push(serialPortAuxArray);
        const parser = serialPortAuxArray.pipe(new ReadlineParser({ delimiter: '\n' }));
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

  ipcMain.on('reiniciarFlujometros', async () => {
    try {
      serialPortArray.forEach((element) => {
        element.write("0\n")
      })
    } catch (error) {
      console.log(error)
    }
  })
  ipcMain.on('enviarDataSwichArduino', async (_event, data) => { 
    if(data.data !== ''){
      console.log("---------", data)
      try {
       serialPortArray[data.serial].write(`${data.data}\n`)
      } catch (error) {
        console.log(error)
      }
    }
  })

  ipcMain.on('verificarConexionSensoresMain', async (event) => {
    setTimeout(() => {
      try {
        serialPortArray.forEach((element) => {
          element.write("k\n")
        })
      } catch (error) {
        console.log(error)
      }
      event.reply('verificarConexionSensoresRender', serialPortArray.length)
    }, 1000);
  })
  //#endregion

  //#region WIFI
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
  //#endregion

  //#region Tareas programadas cron
  ipcMain.on('configDistribucionDiaria', (_event, data) => {
    if (data.id === 1) {
      cron.schedule(`${data.datos.minu2} ${data.datos.hora1} * * 1-6`, () => {
        procesoActualPines([{nombre:'bomba 3', estado:1}])
        console.log('tarea inicio bomba')
      }, {
        scheduled: true,
        timezone: "America/Bogota"
      });
    }else {
      cron.schedule(`${data.datos.minu2} ${data.datos.hora1} * * 1-6`, () => {
        procesoActualPines([{nombre:'bomba 3', estado:0}])
        console.log('tarea final bomba')
      }, {
      scheduled: true,
      timezone: "America/Bogota"
      });
    }
  })
  //#endregion

  //#region  proceso pines
  ipcMain.on('procesoPinesSalida', async (_event, message) => {
    procesoActualPines(message)
    console.log(message)
  })
  ipcMain.on('leerPinesSalidaMain', async (event) => {
    leerProcesoActualPines()
    event.reply('leerPinesSalidaRender', leerProcesoActualPines())
  })
  //#endregion
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})