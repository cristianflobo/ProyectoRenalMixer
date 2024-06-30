import { MenssageGeneralContext } from '@renderer/utils/MessageGeneralContext'
import { useEffect, useState } from 'react'
import useHookShared from './useHookShared'
import { reiniciarFlujometros } from '@renderer/utils/metodosCompartidos/metodosCompartidos'
import infoSerialSensores from '@renderer/utils/infoSerialSensores'
import { getConfig } from '@renderer/utils/setConfig'

let configDatos:any = []
let litrosFinalLavado = 0
const serialNumberFlujometros:TconexionSerial[] = infoSerialSensores["chia"]
let contadorEntradaCicloLavado = 0
let contadorEntradaTransferirLitros = 0
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
  const [lavadoTerminado, setlavadoTerminado] = useState(false)
  configDatos = getConfig();

  useEffect(() => { 
    window.electron.ipcRenderer.send('conectarSerial', serialNumberFlujometros)
    window.electron.ipcRenderer.send('verificarConexionSensoresMain')
    if(configDatos){   
      const dispensacionDiariaIni  = configDatos.find(
        (item: TdataConfig) => item.title === 'HORA INICIO DISTRIBUCIÓN'
      )
      const arrayDispensacion = [dispensacionDiariaIni] 
      const dispensacionDiariaFi  = configDatos.find(
        (item: TdataConfig) => item.title === 'HORA FINAL DISTRIBUCIÓN'
      )
      arrayDispensacion.unshift(dispensacionDiariaFi)

      if( dispensacionDiariaIni && dispensacionDiariaFi){
       for (let i = 0; i < arrayDispensacion.length; i++) {
        window.electron.ipcRenderer.send('configDistribucionDiaria', {id:i,datos:arrayDispensacion[i]})
       }  
      }
    }
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
    let cantidadAguaLvado: Tdrenado | undefined
    let tiempoLavado: Tdrenado | undefined
    let tiempoDrenadoLavado: Tdrenado | undefined

    if (activeProceso.proceso === 'transferirLitros' ) {
      if(onOnchangeViewKeyBoardNumeric.data <= datosSerial.dataSerial2){
        if(contadorEntradaTransferirLitros === 0){
          contadorEntradaTransferirLitros = 1
          reiniciarFlujometros()
        }
        eviarProcesoPines([])
      }
    }
    if(configDatos){
      cantidadAguaLvado  = configDatos.find(
        (item: TdataConfig) => item.title === 'CANTIDAD DE AGUA LAVADO (L)'
      )
      litrosFinalLavado = cantidadAguaLvado!.dato
      tiempoLavado = configDatos.find(
        (item: TdataConfig) => item.title === 'TIEMPO LAVADO (MIN)'
      )
      tiempoDrenadoLavado = configDatos.find(
        (item: TdataConfig) => item.title === 'TIEMPO DRENADO EN LAVADO (SEG)'
      )
    }
    if (activeProceso.proceso === 'lavado') {
      if (cantidadAguaLvado && tiempoLavado && tiempoDrenadoLavado) {

        if (cantidadAguaLvado.dato <= parseFloat(datosSerial.dataSerial1) && contadorEntradaCicloLavado === 0) {
            contadorEntradaCicloLavado = 1
            reiniciarFlujometros()
            eviarProcesoPines(['bomba 1', 'valvula 2', 'valvula 3'])
            cancelarSetimeout.push(setTimeout(
              () => {
                eviarProcesoPines(['valvula 5', 'bomba 4'])
                cancelarSetimeout.push(setTimeout(
                  () => {
                    contadorEntradaCicloLavado = 1
                    eviarProcesoPines([])
                    setlavadoTerminado(true)
                  },
                  tiempoDrenadoLavado!.dato * 1000
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
    let tiempoMezclado: TdataConfig | undefined
    switch (ciclo) {
      case 0:
        eviarProcesoPines(procesos[activeProceso.proceso][ciclo].procesoGpio)
        if (activeProceso.proceso === 'lavado') {
          setlavadoTerminado(false)
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
            <div>{datosSerial.dataSerial1 < litrosFinalLavado.toString()?datosSerial.dataSerial1:litrosFinalLavado} L</div>
            {!lavadoTerminado?
              <div className="loader"></div>:null
            }
            <button
              style={{ marginTop: '50px' }}
              onClick={() => {
                resetProcesos()
                contadorEntradaCicloLavado = 0
              }}
            >
              Parar
            </button>
          </div>
        ),
        procesoGpio: ['valvula 5', 'bomba 4']
      },

    ],
    recirculacion:
    [{ //BOTON RECIRCULACION
      id: 0,
      html: (
        <div className="conte-procesos">
          <strong>Recirculando ... </strong>
          <div className="loader"></div>
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
      procesoGpio: ['valvula 2', 'bomba 1']
    }],
    transferir:
   [ { //BOTON TRANSFERIR
      id: 0,
      html: (
        <div className="conte-procesos">
          <strong>Tranfiriendo solucion ...</strong>
          <div>{datosSerial.dataSerial2} L</div>
          <div className="loader"></div>
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
    }],
    transferirLitros:
   [ { //BOTON TRANSFERIR litros
      id: 0,
      html: (
        <div className="conte-procesos">
          <strong>Litros a transferir</strong>
          <div>Digite cantidad</div>
          <div style={{height:"40px", width:"80px", border:"1px solid white", borderRadius:"7px", fontSize:"22px"}}
          onClick={()=> setOnOnchangeViewKeyBoardNumeric({ ...onOnchangeViewKeyBoardNumeric, view: true })}>
            {onOnchangeViewKeyBoardNumeric.data}
          </div>
          <div>
            {datosSerial.dataSerial2 >= onOnchangeViewKeyBoardNumeric.data?
              onOnchangeViewKeyBoardNumeric.data:datosSerial.dataSerial2
            } L
          </div>
          <div>
            <button 
            style={{ marginTop: '50px' }}
            onClick={() => {
              contadorEntradaTransferirLitros = 0
              eviarProcesoPines(['valvula 4', 'bomba 1'])
            }}
          >
            Transferir
          </button>
          <button
            style={{ marginTop: '50px' }}
            onClick={() => {
              resetProcesos()
            }}
          >
            Salir
          </button>
          </div>
        </div>
      ),
      procesoGpio: []
    }]
  }

  const mensajesModal = {
    mesnsajeSensores:
      {
        id: 0,
        html: (
          <div className="conte-procesos">
            <strong style={{marginBottom:"20px"}}>Conexion flujometros, {cantidadFlujometro} sensor</strong>
            <div style={{display:'flex'}}>
              <div 
              style={{
                marginRight:"20px", 
                display:'flex', 
                flexDirection:'column',
                backgroundColor:datosSerial.dataSerial1 === "0"?"red":"green", 
                padding:"5px", 
                borderRadius:"7px"}}>
                <strong >FACTOR K S1 </strong>
                <strong> {datosSerial.dataSerial1}</strong>
              </div>
              <div style={{
                display:'flex', 
                flexDirection:'column',
                backgroundColor:datosSerial.dataSerial2 === "0"?"red":"green", 
                padding:"5px", 
                borderRadius:"7px"}}>
                <strong >FACTOR K S2 </strong>
                <strong> {datosSerial.dataSerial2}</strong>
              </div>
            </div>
            <div  style={{display:"flex"}}>
            <button
              style={{ marginTop: '50px' }}
              onClick={() => cambiarPosicionFujometros()}
            >
              Reconectar
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
      }
  }

  const cambiarPosicionFujometros = ():void => {
    window.electron.ipcRenderer.send('desconectarSerial')
    window.electron.ipcRenderer.send('conectarSerial', serialNumberFlujometros)

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
