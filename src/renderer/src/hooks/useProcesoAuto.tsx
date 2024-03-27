import { useEffect, useState } from 'react'
import useHookShared from './useHookShared'
let configDatos: TdataConfig[]
let cicloGlobal = 0
const useProcesoAuto = (nombreProceso:string, returnHome: () => void) => {
  const { eviarProcesoPines } = useHookShared()
  const [litrosSerial, setLitrosSerial] = useState({ s1: 0, s2: 0 })
  const [ciclo, setCiclo] = useState(0)
  const procesos = {
    procesoAutomatico: [
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
        ),
        procesoGpio: []
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
        ),
        procesoGpio: []
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
        ),
        procesoGpio: []
      }
    ],
    lavado:[  {
      id: 0,
      html: (
        <div className="conte-procesos">
          <strong>Llenado 1</strong>
          <h2>{litrosSerial.s1} L</h2>
        </div>
      ),
      procesoGpio: ['valvula 1']
    }, ]
  }

  useEffect(() => {
    cicloGlobal = ciclo
    let tiempoMezclado: TdataConfig | undefined
    switch (ciclo) {
      case 1:
        eviarProcesoPines(procesos[ciclo].procesoGpio)

        break

      case 2:
        eviarProcesoPines(procesos[ciclo].procesoGpio)
        break

      case 3:
        eviarProcesoPines(procesos[ciclo].procesoGpio)
        break

      case 4:
        tiempoMezclado = configDatos.find(
          (item: TdataConfig) => item.title === 'TIEMPO DE MEZCLADO'
        )
        eviarProcesoPines(procesos[ciclo].procesoGpio)
        if (tiempoMezclado) {
          setTimeout(() => {
            setCiclo(5)
          }, tiempoMezclado?.dato * 1000)
        }
        break

      case 5:
        eviarProcesoPines(procesos[ciclo].procesoGpio)
        break

      default:
        break
    }
    return (): void => {}
  }, [ciclo])

  return {
    procesos,
    litrosSerial,
    ciclo
  }
}

export default useProcesoAuto
