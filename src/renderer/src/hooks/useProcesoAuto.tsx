import { useEffect, useState } from 'react'
import useHookShared from './useHookShared'

const useProcesoAuto = () => {
  const { eviarProcesoPines } = useHookShared()
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
    const prenderApagar = (dat) =>{
      if(dat === 'p' ) {
        eviarProcesoPines([
          {
            nombre: 'valvula 1',
            estado: 1
          },
          {
            nombre: 'valvula 2',
            estado: 0
          },
          {
            nombre: 'valvula 3',
            estado: 0
          },
          {
            nombre: 'valvula 4',
            estado: 0
          },
          {
            nombre: 'valvula 5',
            estado: 0
          },
          {
            nombre: 'valvula 6',
            estado: 0
          },
          {
            nombre: 'bomba 1',
            estado: 0
          },
          {
            nombre: 'bomba 2',
            estado: 0
          },
          {
            nombre: 'bomba 3',
            estado: 0
          }
        ])
      }else {
        eviarProcesoPines([
          {
            nombre: 'valvula 1',
            estado: 0
          },
          {
            nombre: 'valvula 2',
            estado: 0
          },
          {
            nombre: 'valvula 3',
            estado: 0
          },
          {
            nombre: 'valvula 4',
            estado: 0
          },
          {
            nombre: 'valvula 5',
            estado: 0
          },
          {
            nombre: 'valvula 6',
            estado: 0
          },
          {
            nombre: 'bomba 1',
            estado: 0
          },
          {
            nombre: 'bomba 2',
            estado: 0
          },
          {
            nombre: 'bomba 3',
            estado: 0
          }
        ])
      }
    }
  return {
    pasosProcesos,
    litrosSerial,
    prenderApagar
  }
}

export default useProcesoAuto