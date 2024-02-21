import { useEffect, useState } from 'react'

const useProcesoAuto = () => {
    const [pasosProcesos, setPasosProcesos] = useState<any>()
    const [litrosSerial, setLitrosSerial] = useState({s1:0, s2:0})
    useEffect(() => {
      window.electron.ipcRenderer.send('conectarSerial', {path:'/dev/ttyACM0', baud:9600})
      window.electron.ipcRenderer.on('dataSerial1', (_event, data) => {
        console.log('dataSerial1', data)
        setLitrosSerial({...litrosSerial, s1:data})
      })
      window.electron.ipcRenderer.on('dataSerial2', (_event, data) => {
        console.log('dataSerial2', data)
        setLitrosSerial({...litrosSerial, s2:data})
      })
      setPasosProcesos([
        {
          id: 0,
          title: '',
          descripcion: 'llenar primera parte',
          activo: false,
          litros:0,
          procesoPines: [{}]
        }
      ])
      return () => {
        window.electron.ipcRenderer.removeAllListeners('dataSerial1')
        window.electron.ipcRenderer.removeAllListeners('dataSerial2')
      }
    }, [])
  return {
    pasosProcesos,
    litrosSerial
  }
}

export default useProcesoAuto