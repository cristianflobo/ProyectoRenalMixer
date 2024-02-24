import { useEffect, useState } from 'react'
import useHookShared from './useHookShared'
let configDatos: TdataConfig[]
const useProcesoAuto = (datos, returnHome) => {
  const { eviarProcesoPines } = useHookShared()
  const [litrosSerial, setLitrosSerial] = useState({ s1: 0, s2: 0 })
  const [ciclo, setCiclo] = useState(0)
  const [pasosProcesos, setPasosProcesos] = useState<any>([
    {
      id: 0,
      html: (
        <div className="conte-procesos">
          <strong>Llenado 1</strong>
          <h2>{litrosSerial.s1} L</h2>
        </div>
      ),
      procesoGpio: ['valvula 1']
    },
    {
      id: 1,
      html: (
        <div className="conte-procesos">
          <strong>Agregue el polvo al tanque y luego presione el botón continuar</strong>
          <button onClick={() => setCiclo(2)}>Continuar</button>
        </div>
      ),
      procesoGpio: ['buzzer']
    },
    {
      id: 2,
      html: (
        <div className="conte-procesos">
          <strong>Completando llenado 1</strong>
          <h2>{litrosSerial.s1} L</h2>
        </div>
      ),
      procesoGpio: ['valvula 1']
    },
    {
      id: 3,
      html: (
        <div className="conte-procesos">
          <strong>¿Desea iniciar mezclado?</strong>
          <button onClick={() => setCiclo(4)}>Iniciar</button>
        </div>
      ),
      procesoGpio: ['buzzer']
    },
    {
      id: 4,
      html: (
        <div className="conte-procesos">
          <strong>Mezclando la solución</strong>
          <div className="loader"></div>
        </div>
      ),
      procesoGpio: ['valvula 2', 'bomba 1']
    },
    {
      id: 5,
      html: (
        <div className="conte-procesos">
          <strong>Mezcla lista, tome muestra para comprobar calidad</strong>
          <button onClick={() => setCiclo(6)}>llenado tanque de distribución</button>
          <button onClick={() => returnHome({ manual: false, config: false, auto: false })}>
            Inicio
          </button>
        </div>
      ),
      procesoGpio: ['buzzer']
    },
    {
      id: 6,
      html: (
        <div className="conte-procesos">
          <strong>Llenando tanque distribucion</strong>
          <h2>{litrosSerial.s1} L</h2>
          <button onClick={() => returnHome({ manual: false, config: false, auto: false })}>
            Home
          </button>
        </div>
      )
    },
    {
      id: 7,
      html: (
        <div className="conte-procesos">
          <strong>¿Desea iniciar lavado de tanque?</strong>
          <button onClick={() => setCiclo(7)}>ok</button>
          <button onClick={() => returnHome({ manual: false, config: false, auto: false })}>
            Home
          </button>
        </div>
      )
    },
    {
      id: 8,
      html: (
        <div className="conte-procesos">
          <strong>¿Desea iniciar lavado de tanque?</strong>
          <button onClick={() => setCiclo(2)}>ok</button>
          <button onClick={() => returnHome({ manual: false, config: false, auto: false })}>
            Home
          </button>
        </div>
      )
    }
  ])

  useEffect(() => {
    configDatos = JSON.parse(localStorage.getItem('configDatos')!)
    window.electron.ipcRenderer.send('conectarSerial', { path: '/dev/ttyACM0', baud: 9600 })
    window.electron.ipcRenderer.on('dataSerial1', (_event, data) => {
      console.log('dataSerial1', data)
      if (ciclo === 0) {
        if (litrosSerial.s1 === datos[0].dato) {
          // eviarProcesoPines(['buzzer'])
          setCiclo(1)
        }
      }
      if (ciclo === 2) {
        if (litrosSerial.s1 === datos[1].dato) {
          // eviarProcesoPines(['buzzer'])
          setCiclo(3)
        }
      }
      setLitrosSerial({ ...litrosSerial, s1: data })
    })
    window.electron.ipcRenderer.on('dataSerial2', (_event, data) => {
      console.log('dataSerial2', data)
      setLitrosSerial({ ...litrosSerial, s2: data })
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners('dataSerial1')
      window.electron.ipcRenderer.removeAllListeners('dataSerial2')
    }
  }, [])

  useEffect(() => {
    switch (ciclo) {
      case 1:
        eviarProcesoPines(pasosProcesos[ciclo].procesoGpio)
        break

      case 2:
        eviarProcesoPines(pasosProcesos[ciclo].procesoGpio)
        break

      case 3:
        eviarProcesoPines(pasosProcesos[ciclo].procesoGpio)
        break

      case 4:
        let tiempoMezclado = configDatos.find((item) => item.title === 'TIEMPO DE MEZCLADO')
        eviarProcesoPines(pasosProcesos[ciclo].procesoGpio)
        setTimeout(() => {
          setCiclo(5)
        }, tiempoMezclado?.dato)
        break
        
      case 5:
        eviarProcesoPines(pasosProcesos[ciclo].procesoGpio)
        break

      default:
        break
    }
    return () => {}
  }, [ciclo])

  return {
    pasosProcesos,
    litrosSerial,
    ciclo
  }
}

export default useProcesoAuto
