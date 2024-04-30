import { MenssageGeneralContext } from '@renderer/utils/MessageGeneralContext'
import { useEffect, useState } from 'react'
import useHookShared from './useHookShared'
import { reiniciarFlujometros } from '@renderer/utils/metodosCompartidos/metodosCompartidos'

const configDatos = JSON.parse(localStorage.getItem('configDatos')!)
//const serialNumberFlujometros:string[] = ['24238313136351902161', '24238313136351F04182']
const serialNumberFlujometros:string[] = ['24238313136351706120', '24238313136351F04182']
let contadorEntradaCicloLavado = 0
let cancelarSetimeout:ReturnType<typeof setTimeout>[] = []
const useApp = () => {
  const { eviarProcesoPines } = useHookShared()
  const [mensajeGeneral, setmensajeGeneral] = useState({ view: false, data: '' })
  const [cantidadFlujometro, setCantidadFlujometro] = useState(0)
  const [activarMensajesModal, setActivarMensajesModal] = useState({activar:false,ventana:"mesnsajeSensores"})
  const [datosSerial, setDatosSerial] = useState({ dataSerial1: '0', dataSerial2: '0' })
  const [ciclo, setCiclo] = useState(-1)
  const [selectScreen, setSelectScreen] = useState<TselectScreen>({
    manual: false,
    config: false,
    auto: false
  })
  const [activeProceso, setActiveProceso] = useState({ activar: true, proceso: '' })
  const [onOnchangeViewKeyBoardNumeric, setOnOnchangeViewKeyBoardNumeric] = useState({
    view: false,
    data: ''
  })
  const [numeroCicloLavados, setNumeroCicloLavados] = useState(0)
  const [lavadoTerminado, setlavadoTerminado] = useState(false)

  useEffect(() => {
    const cantidadAguaLvado: Tdrenado | undefined = configDatos.find(
      (item: TdataConfig) => item.title === 'CANTIDAD DE AGUA LAVADO (L)'
    )
    const tiempoLavado: Tdrenado | undefined = configDatos.find(
      (item: TdataConfig) => item.title === 'TIEMPO LAVADO (MIN)'
    )
    const tiempoDrenadoLavado: Tdrenado | undefined = configDatos.find(
      (item: TdataConfig) => item.title === 'TIEMPO DRENADO EN LAVADO (SEG)'
    )

    if (activeProceso.proceso === 'lavado') {
      if (cantidadAguaLvado && tiempoLavado && tiempoDrenadoLavado) {
        
        if (cantidadAguaLvado.dato <= datosSerial.dataSerial1 && contadorEntradaCicloLavado === 0) {
          
            contadorEntradaCicloLavado = 1
            reiniciarFlujometros()
            eviarProcesoPines(['bomba 1', 'valvula 2', 'valvula 3'])
            cancelarSetimeout.push(setTimeout(
              () => {
                eviarProcesoPines(['valvula 5'])
                cancelarSetimeout.push(setTimeout(
                  () => {
                    if(numeroCicloLavados === 1) {
                      contadorEntradaCicloLavado = 0
                      reiniciarFlujometros()
                      eviarProcesoPines(['valvula 1'])
                      setNumeroCicloLavados(0)
                   }else {
                    contadorEntradaCicloLavado = 0
                    eviarProcesoPines([])
                    setlavadoTerminado(true)
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
    return ():void => {
    }
  }, [datosSerial])


  useEffect(() => {
    window.electron.ipcRenderer.send('conectarSerial', serialNumberFlujometros[0])
    window.electron.ipcRenderer.send('conectarSerial', serialNumberFlujometros[1])
    window.electron.ipcRenderer.send('reiniciarFlujometros')
    window.electron.ipcRenderer.send('verificarConexionSensoresMain')
    window.electron.ipcRenderer.on('verificarConexionSensoresRender',(_event, data) => {  
      setCantidadFlujometro(data)
      setActivarMensajesModal((prev)=> ({...prev, activar:true}))
    })
    window.electron.ipcRenderer.on('dataSerial1', (_event, data) => {
      setDatosSerial((prev) => ({ ...prev, dataSerial1: data }))
    })
    window.electron.ipcRenderer.on('dataSerial2', (_event, data) => {
      setDatosSerial((prev) => ({ ...prev, dataSerial2: data }))
    })
    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('dataSerial1')
      window.electron.ipcRenderer.removeAllListeners('dataSerial2')
      window.electron.ipcRenderer.removeAllListeners('verificarConexionSensoresRender')
    }
  }, [])

  useEffect(() => {
    let tiempoMezclado: TdataConfig | undefined
    switch (ciclo) {
      case 0:
        eviarProcesoPines(procesos[activeProceso.proceso][ciclo].procesoGpio)
        if (activeProceso.proceso === 'lavado') {
          setlavadoTerminado(false)
          setNumeroCicloLavados(1)
          const tiempoDrenado = configDatos.find(
            (item: TdataConfig) => item.title === 'TIEMPO DRENADO PRELIMINAR (SEG)'
          )
          if (tiempoDrenado) {
            cancelarSetimeout.push(setTimeout(() => {
              reiniciarFlujometros()
              eviarProcesoPines(['valvula 1'])
            }, tiempoDrenado.dato * 1000))
          }
        }
        break

      case 1:
        eviarProcesoPines(procesos[activeProceso.proceso][ciclo].procesoGpio)
        break

      case 2:
        eviarProcesoPines(procesos[activeProceso.proceso][ciclo].procesoGpio)
        break

      case 3:
        eviarProcesoPines(procesos[activeProceso.proceso][ciclo].procesoGpio)
        break

      case 4:
        eviarProcesoPines(procesos[activeProceso.proceso][ciclo].procesoGpio)
        if (tiempoMezclado) {
          setTimeout(() => {
            setCiclo(5)
          }, tiempoMezclado?.dato * 1000)
        }
        break

      case 5:
        eviarProcesoPines(procesos[activeProceso.proceso][ciclo].procesoGpio)
        break

      default:
        break
    }
    return (): void => {}
  }, [ciclo])

  const procesos = {
    procesoAutomatico: [],
    lavado: [
      {
        id: 0,
        html: (
          <div className="conte-procesos">
            <strong>{lavadoTerminado?"Lavado terminado":"Lavando"}</strong>
            <button
              style={{ marginTop: '50px' }}
              onClick={() => {
                resetProcesos()
              }}
            >
              Parar
            </button>
          </div>
        ),
        procesoGpio: ['valvula 5']
      },

    ],
    recirculacion:
    [{ //BOTON RECIRCULACION
      id: 0,
      html: (
        <div className="conte-procesos">
          <strong>Recirculando ... </strong>
          <button
            style={{ marginTop: '50px' }}
            onClick={() => {
              resetProcesos()
            }}
          >
            Parar
          </button>
        </div>
      ),
      procesoGpio: ['valvula 2', 'valvula 3', 'bomba 1']
    }],
    transferir:
   [ { //BOTON TRANSFERIR
      id: 0,
      html: (
        <div className="conte-procesos">
          <strong>Tranfiriendo solucion ...</strong>
          <button
            style={{ marginTop: '50px' }}
            onClick={() => {
              resetProcesos()
            }}
          >
            Parar
          </button>
        </div>
      ),
      procesoGpio: ['valvula 4', 'bomba 1']
    }]
  }

  const mensajesModal = {
    mesnsajeSensores:
      {
        id: 0,
        html: (
          <div className="conte-procesos">
            <strong>Conexion flujometros, {cantidadFlujometro} sensor</strong>
            <div>
            <strong style={{marginRight:"20px"}}>s1 {datosSerial.dataSerial1} L </strong>
            <strong>s2 {datosSerial.dataSerial2} L </strong>
            </div>
            <div  style={{display:"flex"}}>
            <button
              style={{ marginTop: '50px' }}
              onClick={() => {
                eviarProcesoPines(['valvula 1'])
                setTimeout(() => {
                  resetProcesos()
                }, 3000);
                setActiveProceso({ activar: false, proceso: '' })
              }}
            >
              Probar S1
            </button>
            <button
              style={{ marginTop: '50px' }}
              onClick={() => cambiarPosicionFujometros()}
            >
              cambiar
            </button>
            <button
              style={{ marginTop: '50px' }}
              onClick={() => {
                setActivarMensajesModal((prev)=> ({...prev, activar:false}))
                resetProcesos()
              }}
            >
             Cerrar
            </button>
            </div>
          </div>
        )
      },
  }

  const cambiarPosicionFujometros = ():void => {
    window.electron.ipcRenderer.send('desconectarSerial')
    serialNumberFlujometros[0], serialNumberFlujometros[1] =
    serialNumberFlujometros[1], serialNumberFlujometros[0]
    setTimeout(() => {
      setTimeout(() => {
        window.electron.ipcRenderer.send('conectarSerial', serialNumberFlujometros[0])
      }, 500);
      setTimeout(() => {
        window.electron.ipcRenderer.send('conectarSerial', serialNumberFlujometros[1])
      }, 500);
    }, 500);

  }

  const resetProcesos = ():void => {
    cancelarSetimeout.forEach(element => {
      clearTimeout(element)
    });
    cancelarSetimeout = []
    setActiveProceso({ activar: false, proceso: '' })
    setCiclo(-1)
    eviarProcesoPines([])
    reiniciarFlujometros()
  }
  return {
    setOnOnchangeViewKeyBoardNumeric,
    setActivarMensajesModal,
    setmensajeGeneral,
    setActiveProceso,
    setSelectScreen,
    setCiclo,
    selectScreen,
    onOnchangeViewKeyBoardNumeric,
    MenssageGeneralContext,
    activarMensajesModal,
    mensajeGeneral,
    mensajesModal,
    activeProceso,
    datosSerial,
    procesos,
    ciclo
  }
}

export default useApp
