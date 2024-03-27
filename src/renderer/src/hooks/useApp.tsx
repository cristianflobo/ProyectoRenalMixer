import { MenssageGeneralContext } from '@renderer/utils/MessageGeneralContext'
import { useEffect, useState } from 'react'
import useHookShared from './useHookShared'
import { reiniciarFlujometros } from '@renderer/utils/metodosCompartidos/metodosCompartidos'

const configDatos = JSON.parse(localStorage.getItem('configDatos')!)
const useApp = () => {
  const { eviarProcesoPines } = useHookShared()
  const [mensajeGeneral, setmensajeGeneral] = useState({ view: false, data: '' })
  const [activarMenuWifi, setActivarMenuWifi] = useState(false)
  const [nombreWifiConectada, setNombreWifiConectada] = useState('no Connected')
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
    if (activeProceso.proceso) {
      if(datosSerial.dataSerial1 >= configDatos[4].dato) setCiclo(1)
    }
    return ():void => {
    }
  }, [datosSerial])
  

  useEffect(() => {
    // window.electron.ipcRenderer.send('conectarSerial', { path: '/dev/ttyACM0', baud: 9600 })
    window.electron.ipcRenderer.send('conectarSerial', { path: 'COM4', baud: 9600 })
    window.electron.ipcRenderer.send('reiniciarFlujometros')
    window.electron.ipcRenderer.on('dataSerial1', (_event, data) => {
      setDatosSerial((prev) => ({ ...prev, dataSerial1: data }))
    })
    window.electron.ipcRenderer.on('dataSerial2', (_event, data) => {
      setDatosSerial((prev) => ({ ...prev, dataSerial2: data }))
    })
    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('dataSerial1')
      window.electron.ipcRenderer.removeAllListeners('dataSerial2')
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
  const menuWifiConfig = (): void => {
    setActivarMenuWifi((pre) => !pre)
  }

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
              CERRAR
            </button>
          </div>
        ),
        procesoGpio: ['valvula 1', 'bomba 1']
      },
      {
        id: 1,
        html: (
          <div className="conte-procesos">
            <strong>Lavando </strong>
            <button
              style={{ marginTop: '50px' }}
              onClick={() => {
                resetProcesos()
              }}
            >
              CERRAR
            </button>
          </div>
        ),
        procesoGpio: ['valvula 1', 'bomba 1']
      }
    ]
  }

  const resetProcesos = ():void => {
    setActiveProceso({ activar: false, proceso: '' })
    setCiclo(-1)
    eviarProcesoPines([])
    reiniciarFlujometros()
  }
  return {
    setOnOnchangeViewKeyBoardNumeric,
    setNombreWifiConectada,
    setmensajeGeneral,
    setActiveProceso,
    setSelectScreen,
    menuWifiConfig,
    setCiclo,
    nombreWifiConectada,
    activarMenuWifi,
    selectScreen,
    onOnchangeViewKeyBoardNumeric,
    MenssageGeneralContext,
    mensajeGeneral,
    activeProceso,
    datosSerial,
    procesos,
    ciclo
  }
}

export default useApp
