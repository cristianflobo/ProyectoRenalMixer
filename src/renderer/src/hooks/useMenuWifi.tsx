import { useEffect, useState } from 'react'

const useMenuWifi = (nombreWifiConect:(c)=>void): object => {
  const [listaWifi, setListaWifi] = useState([])
  const [activarInput, setActivarInput] = useState(false)
  const [contrasena, setContrasena] = useState('')
 
  window.electron.ipcRenderer.on('listaWifi', (_event, data) => {
    setListaWifi(data)
  })
  useEffect(() => {
    window.electron.ipcRenderer.send('listarWifi')
    window.electron.ipcRenderer.on('conexionCompleta', (_event, data) => {
      if(navigator.onLine) {
        // el navegador está conectado a la red
        nombreWifiConect(data)
    } else {
        // el navegador NO está conectado a la red
        nombreWifiConect('--------')
    }
    })
    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('conexionCompleta')
    }
  }, [])

  const ingresarDatos = ():void => {
    setActivarInput(true)
  }
  const conectarWifi = (nombreWifi: string, contrasena: string): void => {
    window.electron.ipcRenderer.send('conectarWifi', {
      ssid: nombreWifi,
      contrasena
    })
  }
  console.log(listaWifi)
  return { setContrasena, ingresarDatos, conectarWifi, contrasena, listaWifi, activarInput }
}

export default useMenuWifi
