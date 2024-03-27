import { useEffect, useState } from 'react'

const useMenuWifi = (nombreWifiConect: (c) => void): object => {
  const [listaWifi, setListaWifi] = useState([])
  const [activarInput, setActivarInput] = useState({activar:false, ssid:""})
  const [contrasena, setContrasena] = useState('')

  window.electron.ipcRenderer.on('listaWifi', (_event, data) => {
    setListaWifi(data)
  })
  useEffect(() => {
    window.electron.ipcRenderer.send('listarWifi')
    window.electron.ipcRenderer.on('conexionCompleta', (_event, data) => {
      if (navigator.onLine) {
        // el navegador está conectado a la red
        nombreWifiConect(data)
      } else {
        // el navegador NO está conectado a la red
        nombreWifiConect(data)
      }
    })
    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('conexionCompleta')
    }
  }, [])

  const ingresarDatos = (ssid:string): void => {
    console.log("ssid", ssid)
    setActivarInput({activar:true, ssid})
  }
  const conectarWifi = (nombreWifi: string): void => {
    window.electron.ipcRenderer.send('conectarWifi', {
      ssid: nombreWifi,
      contrasena
    })
  }
  console.log(navigator.onLine)
  return { setContrasena, ingresarDatos, conectarWifi, contrasena, listaWifi, activarInput }
}

export default useMenuWifi
