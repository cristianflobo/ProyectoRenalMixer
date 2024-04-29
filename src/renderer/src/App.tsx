import { ClockTime, KeyBoardNumeric, Message, NavBa } from './components/'
import useApp from './hooks/useApp'
import { Automatico } from './screens/automatico/Automatico'
import { ConfigMixer } from './screens/configMixer/ConfigMixer'
import { Manual } from './screens/manual/Manual'
import { reiniciarFlujometros } from './utils/metodosCompartidos/metodosCompartidos'

function App(): JSX.Element {
  const {
    setOnOnchangeViewKeyBoardNumeric,
    setActivarMensajesModal,
    setmensajeGeneral,
    setActiveProceso,
    setSelectScreen,
    setCiclo,
    onOnchangeViewKeyBoardNumeric,
    MenssageGeneralContext,
    activarMensajesModal,
    mensajeGeneral,
    mensajesModal,
    activeProceso,
    selectScreen,
    datosSerial,
    procesos,
    ciclo
  } = useApp()
  return (
    <MenssageGeneralContext.Provider value={{ mensajeGeneral, setmensajeGeneral }}>
      <div className="conteiner">
        <NavBa />
        <ClockTime />
        <div className="btn-principal">
          <button disabled={activeProceso.activar} onClick={() => setSelectScreen({ manual: true, config: false, auto: false })}>
            MANUAL
          </button>
          <button disabled={activeProceso.activar} onClick={() => {setActiveProceso({ activar: true, proceso: 'lavado' }); setCiclo(0) }}>
            LAVADO
          </button>
          <button disabled={activeProceso.activar} onClick={() => {setActiveProceso({ activar: true, proceso: 'recirculacion' }); setCiclo(0) }}>
            RECIRCULACION
          </button>
          <button disabled={activeProceso.activar} onClick={() => {setSelectScreen({ manual: false, config: false, auto: true }); reiniciarFlujometros()}}>
            MEZCLADO
          </button>
          <button disabled={activeProceso.activar}  onClick={() => {setActiveProceso({ activar: true, proceso: 'transferir' }); setCiclo(0) }}>
            TRANSFERIR
          </button>
          <button disabled={activeProceso.activar} onClick={() => setSelectScreen({ manual: false, config: true, auto: false })}>
            CONFIGURACION
          </button>
        </div>
        <button onClick={() =>  setActivarMensajesModal((prev)=> ({...prev, activar:true}))}>
            PROBAR SENSORES
          </button>
        {selectScreen.config ? <ConfigMixer closeWindows={setSelectScreen} /> : null}
        {selectScreen.manual ? <Manual closeWindows={setSelectScreen} /> : null}
        {selectScreen.auto ? (
          <Automatico datosSerial={datosSerial} closeWindows={setSelectScreen} />
        ) : null}
        {onOnchangeViewKeyBoardNumeric.view ? (
          <KeyBoardNumeric setKey={setOnOnchangeViewKeyBoardNumeric} />
        ) : null}

        {mensajeGeneral.view ? <Message /> : null}
      </div>
      {activeProceso.activar ? (
        <div className="cont-proceso-auto">{procesos[activeProceso.proceso][ciclo].html}</div>
      ) : null}
      {activarMensajesModal.activar ? (
        <div className="cont-proceso-auto">{mensajesModal[activarMensajesModal.ventana].html}</div>
      ) : null}

    </MenssageGeneralContext.Provider>
  )
}

export default App
