import { useEffect, useState } from 'react'
import useHookShared from './useHookShared'
import { mensajeOkCancel } from '@renderer/utils/sweetalert2'

const useAutomatico = (datosSerial, closeWindows) => {
  const { eviarProcesoPines } = useHookShared()
  const [posicionDataConfig, setposicionDataConfig] = useState(0)
  const [configDatos, setconfigDatos] = useState<TdataConfig[]>([])
  const [onOnchangeViewKeyBoardNumeric, setOnOnchangeViewKeyBoardNumeric] = useState({
    view: false,
    data: ''
  })
  const [renderData, setrenderData] = useState<TdataRenderAuto[]>([
    { title: '', dato: 0 },
    { title: '', dato: 0 }
  ])
  const [activeProceso, setActiveProceso] = useState(false)
  const [ciclo, setCiclo] = useState(-1)
  useEffect(() => {
    const configDatos = localStorage.getItem('configDatos')
    setconfigDatos(JSON.parse(configDatos!))
    const datosAutomatico = localStorage.getItem('datosAutomatico')
    if (datosAutomatico) {
      setrenderData(JSON.parse(datosAutomatico))
    } else {
      localStorage.setItem(
        'datosAutomatico',
        JSON.stringify([
          {
            title: 'CANTIDAD DE AGUA L',
            dato: 0
          },
          {
            title: 'CANTIDAD DE AGUA PARA AGREGAR POLVO',
            dato: 0
          }
        ])
      )
      const data = localStorage.getItem('datosAutomatico')
      setrenderData(JSON.parse(data!))
    }
    return (): void => {}
  }, [])

  useEffect(() => {
    if (onOnchangeViewKeyBoardNumeric.data !== '' && !onOnchangeViewKeyBoardNumeric.view) {
      const dataKeyTermporal = renderData?.map((item: TdataRenderAuto, i: number) => {
        if (i === posicionDataConfig)
          return { ...item, dato: parseFloat(onOnchangeViewKeyBoardNumeric.data) }
        return item
      })
      setrenderData(dataKeyTermporal)
      localStorage.setItem('datosAutomatico', JSON.stringify(dataKeyTermporal))
    }
    return (): void => {}
  }, [onOnchangeViewKeyBoardNumeric.view])

  useEffect(() => {
    let tiempoMezclado: TdataConfig | undefined
    switch (ciclo) {
      case 0:
        eviarProcesoPines(procesoAutomatico[ciclo].procesoGpio)

        break
      case 1:
        eviarProcesoPines(procesoAutomatico[ciclo].procesoGpio)
        setTimeout(() => {
          eviarProcesoPines( ['bomba 1', 'valvula 2'])
        }, 30000)
        break

      case 2:
        eviarProcesoPines(procesoAutomatico[ciclo].procesoGpio)
        break

      case 3:
        tiempoMezclado = configDatos.find(
          (item: TdataConfig) => item.title === 'TIEMPO DE MEZCLADO'
        )
        eviarProcesoPines(procesoAutomatico[ciclo].procesoGpio)
        if (tiempoMezclado) {
          setTimeout(
            () => {
              setCiclo(4)
            },
            tiempoMezclado?.dato * 1000 * 60
          )
        }
        setTimeout(() => {
          eviarProcesoPines(['bomba 1', 'valvula 2'])
        }, 30000)
        break

      case 4:
        setTimeout(() => {
          eviarProcesoPines([])
        }, 30000)
        break

      case 5:
        eviarProcesoPines(procesoAutomatico[ciclo].procesoGpio)
        break

      default:
        break
    }
    return (): void => {}
  }, [ciclo])

  useEffect(() => {
    if (ciclo === 0 && renderData[0].dato < datosSerial.dataSerial1) setCiclo(1)
    if (ciclo === 2 && renderData[1].dato < datosSerial.dataSerial1) setCiclo(3)

    return (): void => {
      renderData[0].dato
    }
  }, [datosSerial])

  const procesoAutomatico = [
    {
      id: 0,
      display: 'none',
      html: <div className="conte-procesos"></div>,
      procesoGpio: ['valvula 1']
    },
    {
      id: 1,
      display: 'flex',
      html: (
        <div className="conte-procesos">
          <strong>Agregue el polvo al tanque y luego presione el botón continuar</strong>
          <button onClick={() => setCiclo(2)}>Continuar</button>
        </div>
      ),
      procesoGpio: ['buzzer', 'bomba 1', 'valvula 2']
    },
    {
      //espera sensor 1 segundo lllenado
      id: 2,
      display: 'none',
      html: <div className="conte-procesos"></div>,
      procesoGpio: ['valvula 1']
    },
    {
      id: 3,
      display: '',
      html: (
        <div className="conte-procesos">
          <strong>Mesclando ...</strong>
          <div className="loader"></div>
        </div>
      ),
      procesoGpio: ['buzzer', 'bomba 1', 'valvula 2']
    },
    {
      id: 4,
      display: '',
      html: (
        <div className="conte-procesos">
          <strong>Mezcla lista, tome muestra para comprobar calidad</strong>  
          <div style={{display:"flex"}}>
          <button onClick={() => closeWindows({ manual: false, config: false, auto: false })}>Inicio</button>
          <button onClick={() => setCiclo(5)}>Tranferir a tanque distribución</button>
          </div>      
        </div>
      ),
      procesoGpio: ['buzzer']
    },
    {
      id: 5,
      display: '',
      html: (
        <div className="conte-procesos">
          <div style={{display:"flex"}}>
          <button onClick={() => setCiclo(6)}>Tranferir completo</button>
          <button onClick={() => setCiclo(5)}>Tranferir a tanque distribución</button>
          <button onClick={() => closeWindows({ manual: false, config: false, auto: false })}>Inicio</button>
          </div>  
        </div>
      ),
      procesoGpio: []
    },
    {
      id: 6,
      display: '',
      html: (
        <div className="conte-procesos">
          <strong>Llenando tanque distribucion</strong>
          <h2>litrosSerial.s1 L</h2>
          {/* <button onClick={() => returnHome({ manual: false, config: false, auto: false })}>
            Home
          </button> */}
        </div>
      ),
      procesoGpio: []
    },
    {
      id: 7,
      display: '',
      html: (
        <div className="conte-procesos">
          <strong>¿Desea iniciar lavado de tanque?</strong>
          <button onClick={() => setCiclo(7)}>ok</button>
          {/* <button onClick={() => returnHome({ manual: false, config: false, auto: false })}>
            Home
          </button> */}
        </div>
      ),
      procesoGpio: []
    },
    {
      id: 8,
      display: '',
      html: (
        <div className="conte-procesos">
          <strong>¿Desea iniciar lavado de tanque?</strong>
          <button onClick={() => setCiclo(2)}>ok</button>
          {/* <button onClick={() => returnHome({ manual: false, config: false, auto: false })}>
            Home
          </button> */}
        </div>
      ),
      procesoGpio: []
    }
  ]

  const activeKeyBoardNumeric = (posicion: number): void => {
    setposicionDataConfig(posicion)
    setOnOnchangeViewKeyBoardNumeric({ ...onOnchangeViewKeyBoardNumeric, view: true })
  }

  const botonAtras = (): void => {
    if (activeProceso) {
      mensajeOkCancel(
        'Desea salir al inicio',
        () => closeWindows({ manual: false, config: false, auto: false }),
        ''
      )
    } else {
      closeWindows({ manual: false, config: false, auto: false })
    }
  }
  return {
    setOnOnchangeViewKeyBoardNumeric,
    activeKeyBoardNumeric,
    setActiveProceso,
    onOnchangeViewKeyBoardNumeric,
    procesoAutomatico,
    activeProceso,
    renderData,
    botonAtras,
    setCiclo,
    ciclo
  }
}

export default useAutomatico
