import { MenssageGeneralContext } from '@renderer/utils/MessageGeneralContext'
import { useEffect, useState } from 'react'
import useHookShared from './useHookShared'
import { reiniciarFlujometros } from '@renderer/utils/metodosCompartidos/metodosCompartidos'

const configDatos = JSON.parse(localStorage.getItem('configDatos')!)

const useApp = () => {
  const { eviarProcesoPines } = useHookShared()
  const [mensajeGeneral, setmensajeGeneral] = useState({ view: false, data: '' })
  const [activarMensajesModal, setActivarMensajesModal] = useState(false)
  const [datosSerial, setDatosSerial] = useState({ dataSerial1: '0', dataSerial2: '0' })
  const [ciclo, setCiclo] = useState(-1)
  const [selectScreen, setSelectScreen] = useState<TselectScreen>({
    manual: false,
    config: false,
    auto: false
  })
  const [activeProceso, setActiveProceso] = useState({ activar: false, proceso: '' })
  const [onOnchangeViewKeyBoardNumeric, setOnOnchangeViewKeyBoardNumeric] = useState({
    view: false,
    data: ''
  })

  useEffect(() => {
    if (activeProceso.proceso === 'lavado') {
      if(datosSerial.dataSerial1 >= configDatos[4].dato) setCiclo(-1)
    }
    return ():void => {
    }
  }, [datosSerial])
  

  useEffect(() => {
    window.electron.ipcRenderer.send('conectarSerial', '0043')
    window.electron.ipcRenderer.send('conectarSerial', '0042')
    window.electron.ipcRenderer.send('reiniciarFlujometros')
    window.electron.ipcRenderer.send('verificarConexionSensoresMain')
    window.electron.ipcRenderer.on('verificarConexionSensoresRender',() => {
      setActivarMensajesModal(true)
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
            <strong>Lavando </strong>
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
        procesoGpio: ['valvula 1', 'bomba 1']
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
            <strong>comprovando conexion flujometros</strong>
            <div>
            <strong style={{marginRight:"20px"}}>s1 {datosSerial.dataSerial1} L </strong>
            <strong>s2 {datosSerial.dataSerial2} L </strong>
            </div>
            <div  style={{display:"flex"}}>
            <button
              style={{ marginTop: '50px' }}
              onClick={() => {
                eviarProcesoPines(['valvula 1', 'bomba 1'])
                setTimeout(() => {
                  resetProcesos()
                }, 5000);
              }}
            >
              Probar S1
            </button>
            <button
              style={{ marginTop: '50px' }}
              onClick={() => {
                setActivarMensajesModal(false)
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

  const resetProcesos = ():void => {
    setActiveProceso({ activar: false, proceso: '' })
    setCiclo(-1)
    eviarProcesoPines([])
    reiniciarFlujometros()
  }
  return {
    setOnOnchangeViewKeyBoardNumeric,
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
