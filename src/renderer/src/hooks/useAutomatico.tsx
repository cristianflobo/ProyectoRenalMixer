import { useEffect, useState } from 'react'
import useHookShared from './useHookShared'
import { reiniciarFlujometros } from '@renderer/utils/metodosCompartidos/metodosCompartidos'
import { prcTimeout } from 'precision-timeout-interval';

let contadorMezcladoLavado = 0
let cancelarSetimeout:ReturnType<typeof setTimeout>;
let cancelarTodosSetimeout:ReturnType<typeof setTimeout>[] = []

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
  const [numeroCicloLavados, setNumeroCicloLavados] = useState(1)
  const [mensajeAlerta, setMensajeAlerta] = useState(-1)

  useEffect(() => {
    const configDatos = localStorage.getItem('configDatos')
    const litrosAlmacenados = localStorage.getItem('litrosAlmacenados')
    setconfigDatos(JSON.parse(configDatos!))
    const datosAutomatico = localStorage.getItem('datosAutomatico')

    if(datosAutomatico){
      const buscar = JSON.parse(datosAutomatico!).find(item => item.title === 'CANTIDAD DE AGUA FINAL')
      if ( buscar) {
        setrenderData(JSON.parse(datosAutomatico))
      } else {
        localStorage.setItem(
          'datosAutomatico',
          JSON.stringify([
            {
              title: 'CANTIDAD DE AGUA FINAL',
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
    }else {
      localStorage.setItem(
        'datosAutomatico',
        JSON.stringify([
          {
            title: 'CANTIDAD DE AGUA FINAL',
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
    if(!litrosAlmacenados){
      localStorage.setItem('litrosAlmacenados', "0")
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
    if (ciclo === 0 && renderData[1].dato <= datosSerial.dataSerial1) setCiclo(1)
    if (ciclo === 2 && renderData[0].dato <= datosSerial.dataSerial1) setCiclo(3)
    if (ciclo === 6 && renderData[0].dato  < datosSerial.dataSerial2)
     {
      localStorage.setItem('litrosAlmacenados', "0")
      eviarProcesoPines([])
      setCiclo(10)
    }
    const cantidadAguaLvado: Tdrenado | undefined = configDatos.find(
      (item: TdataConfig) => item.title === 'CANTIDAD DE AGUA LAVADO (L)'
    )
    const tiempoLavado: Tdrenado | undefined = configDatos.find(
      (item: TdataConfig) => item.title === 'TIEMPO LAVADO (MIN)'
    )
    const tiempoDrenadoLavado: Tdrenado | undefined = configDatos.find(
      (item: TdataConfig) => item.title === 'TIEMPO DRENADO EN LAVADO (SEG)'
    )

    if (cantidadAguaLvado && tiempoLavado && tiempoDrenadoLavado) {
      if ((ciclo === 7 || ciclo === 8) && cantidadAguaLvado.dato <= datosSerial.dataSerial1) {
        if(contadorMezcladoLavado === 1) {
          eviarProcesoPines(['bomba 1', 'valvula 2', 'valvula 3'])
          contadorMezcladoLavado = 0
          cancelarTodosSetimeout.push(
            setTimeout(
            () => {
              eviarProcesoPines(['valvula 5', 'bomba 4'])
              cancelarTodosSetimeout.push(setTimeout(
                () => {
                  if (numeroCicloLavados === 1) {
                    setCiclo(8)
                    setNumeroCicloLavados(2)
                  } else {
                    setCiclo(9)
                  }
                },
                tiempoDrenadoLavado.dato * 1000
              ))
            },
            tiempoLavado.dato * 1000 * 60
          ))
        }

      }
    }

    return (): void => {
      renderData[0].dato
    }
  }, [datosSerial])

  useEffect(() => {
    let tiempoMezclado: TdataConfig | undefined
    let tiempoDrenado: Tdrenado | undefined
    switch (ciclo) {
      case 0:
        eviarProcesoPines(procesoAutomatico[ciclo].procesoGpio)

        break
      case 1:
        eviarProcesoPines(procesoAutomatico[ciclo].procesoGpio)
        window.electron.ipcRenderer.send('enviarDataSwichArduino', {
          data: "d",
          serial: 0
        })
        cancelarSetimeout = setTimeout(() => {
          eviarProcesoPines(['bomba 1', 'valvula 2'])
        }, 2000)
        cancelarTodosSetimeout.push(cancelarSetimeout)
        break

      case 2:
        clearTimeout(cancelarSetimeout)
        window.electron.ipcRenderer.send('enviarDataSwichArduino', {
          data: "a",
          serial: 0
        })
        eviarProcesoPines(procesoAutomatico[ciclo].procesoGpio)
        break

      case 3:
        tiempoMezclado = configDatos.find(
          (item: TdataConfig) => item.title === 'TIEMPO DE MEZCLADO (MIN)'
        )
        eviarProcesoPines(procesoAutomatico[ciclo].procesoGpio)
        if (tiempoMezclado) {
          cancelarTodosSetimeout.push(setTimeout(
            () => {
              setCiclo(4)
            },
            tiempoMezclado?.dato * 1000 * 60
          ))
        }

        break

      case 4:
        eviarProcesoPines(procesoAutomatico[ciclo].procesoGpio)
        // cancelarSetimeout = setTimeout(() => {
        //   eviarProcesoPines([])
        // }, 5000)
        prcTimeout(3000, () => eviarProcesoPines([]) );
        cancelarTodosSetimeout.push(cancelarSetimeout)

        break

      case 5:
        clearTimeout(cancelarSetimeout)
        eviarProcesoPines(procesoAutomatico[ciclo].procesoGpio)
        break

      case 6:
        eviarProcesoPines(procesoAutomatico[ciclo].procesoGpio)
        break

      case 7: //lavado
        tiempoDrenado = configDatos.find(
          (item: TdataConfig) => item.title === 'TIEMPO DRENADO PRELIMINAR (SEG)'
        )
        contadorMezcladoLavado = 1
        eviarProcesoPines(procesoAutomatico[ciclo].procesoGpio)
        setNumeroCicloLavados(1)
        if (tiempoDrenado) {
          cancelarTodosSetimeout.push(setTimeout(() => {
            reiniciarFlujometros()
            eviarProcesoPines(['valvula 1'])
          }, tiempoDrenado.dato * 1000))
        }
        break

      case 8: //lavado
        tiempoDrenado = configDatos.find(
          (item: TdataConfig) => item.title === 'TIEMPO DRENADO PRELIMINAR (SEG)'
        )
        contadorMezcladoLavado = 1
        eviarProcesoPines(procesoAutomatico[ciclo].procesoGpio)
        if (tiempoDrenado) {
          cancelarTodosSetimeout.push(setTimeout(() => {
            reiniciarFlujometros()
            eviarProcesoPines(['valvula 1'])
          }, tiempoDrenado.dato * 1000))
        }
        break

      case 9: //termina lavado
        eviarProcesoPines(procesoAutomatico[ciclo].procesoGpio)
        contadorMezcladoLavado = 0
        cancelarTodosSetimeout.push(setTimeout(() => {
          eviarProcesoPines([])
        }, 5000))
        break

      case 10:
          eviarProcesoPines(procesoAutomatico[ciclo].procesoGpio)
          cancelarTodosSetimeout.push(setTimeout(() => {
            eviarProcesoPines([])
          }, 5000))

        break

      default:
        break
    }
    return (): void => {}
  }, [ciclo])

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
      //espera sensor 1 segundo llenado
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
          <strong>Mezclando ...</strong>
          <div className="loader"></div>
        </div>
      ),
      procesoGpio: ['bomba 1', 'valvula 2']
    },
    {
      id: 4,
      display: '',
      html: (
        <div className="conte-procesos">
          <strong>Mezcla lista, tome muestra para comprobar calidad</strong>
          <div style={{ display: 'flex' }}>
            <button onClick={() => {
              closeWindows({ manual: false, config: false, auto: false })
              localStorage.setItem('litrosAlmacenados', renderData[0].dato.toString())
              eviarProcesoPines([])
               clearTimeout(cancelarSetimeout)
              }}>
              Inicio
            </button>
            <button onClick={() => {
              setCiclo(5)
              eviarProcesoPines([])
              clearTimeout(cancelarSetimeout)
               }}>Transferir a tanque distribución</button>
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
          <div style={{ display: 'flex' }}>
            <button onClick={() => setCiclo(6)}>Tranferir completo</button>
            <button onClick={() =>{
              closeWindows({ manual: false, config: false, auto: false })
              localStorage.setItem('litrosAlmacenados', renderData[0].dato.toString())
              }}>
              Inicio
            </button>
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
          <strong>Transfiriendo completo...</strong>
          <strong>{datosSerial.dataSerial2} L</strong>
          <div className="loader"></div>
        </div>
      ),
      procesoGpio: ['bomba 1', 'valvula 4']
    },
    {
      id: 7,
      display: '',
      html: (
        <div className="conte-procesos">
          <strong>Transferencia completa</strong>
          <strong>Lavando tanque</strong>
          <div className="loader"></div>
        </div>
      ),
      procesoGpio: ['valvula 5', 'bomba 4']
    },
    {
      id: 8,
      display: '',
      html: (
        <div className="conte-procesos">
          <strong>Transferencia completa</strong>
          <strong>Lavando tanque</strong>
        </div>
      ),
      procesoGpio: ['valvula 5', 'bomba 4']
    },
    {
      id: 9,  //se termina lavado
      display: '',
      html: (
        <div className="conte-procesos">
          <div className="conte-procesos">
            <strong>TANQUE LAVADO</strong>
            <strong>VERIFIQUE QUE EL TANQUE DE MEZCLADO ESTÉ VACÍO Y PRESIONE INICIO</strong>
            <button onClick={() => closeWindows({ manual: false, config: false, auto: false })}>
              Inicio
            </button>
          </div>
        </div>
      ),
      procesoGpio: []
    },
    {
      id: 10,
      display: '',
      html: (
        <div className="conte-procesos">
          <strong>Transferencia completa</strong>
          <strong>Verifique que el tanque de mezclado este vacio y presione inicio</strong>
            <button onClick={() => {
              closeWindows({ manual: false, config: false, auto: false })
              resetProcesos()
              }}>
                Inicio
            </button>
        </div>
      ),
      procesoGpio: ['buzzer']
    },
  ]

  const mensajesAlertas = [
    {
      id: 0,
      display: '',
      html: (
        <div className="conte-procesos">
          <strong>Desea salir al inicio</strong>
          <div>
            <button onClick={() => {
              closeWindows({ manual: false, config: false, auto: false })
              resetProcesos()
              }}>
                Ok
            </button>
            <button onClick={() => {
              setMensajeAlerta(-1)
              }}>
              Cancelar
            </button>
          </div>
        </div>
      ),
    }
  ]
  const activeKeyBoardNumeric = (posicion: number): void => {
    setposicionDataConfig(posicion)
    setOnOnchangeViewKeyBoardNumeric({ ...onOnchangeViewKeyBoardNumeric, view: true })
  }

  const botonAtras = (): void => {
    if(ciclo !== -1) {
      setMensajeAlerta(0)
    }else {
      closeWindows({ manual: false, config: false, auto: false })
    }
  }
  const resetProcesos = ():void => {
    cancelarTodosSetimeout.forEach(element => {
      clearTimeout(element)
    });
    cancelarTodosSetimeout = []
    setCiclo(-1)
    eviarProcesoPines([])
    reiniciarFlujometros()
  }
  return {
    setOnOnchangeViewKeyBoardNumeric,
    activeKeyBoardNumeric,
    setActiveProceso,
    onOnchangeViewKeyBoardNumeric,
    procesoAutomatico,
    mensajesAlertas,
    mensajeAlerta,
    activeProceso,
    renderData,
    botonAtras,
    setCiclo,
    ciclo
  }
}

export default useAutomatico
