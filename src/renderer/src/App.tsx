import { MenuWifi, KeyBoardNumeric, Message, NavBa, FullKeyBoard, ProcesoAuto } from './components/'
import useApp from './hooks/useApp'
import { Automatico } from './screens/automatico/Automatico'
import { ConfigMixer } from './screens/configMixer/ConfigMixer'
import { Manual } from './screens/manual/Manual'
import wifi from './images/wifi.svg'
import { reiniciarFlujometros } from './utils/metodosCompartidos/metodosCompartidos'

function App(): JSX.Element {
  const {
    setOnOnchangeViewKeyBoardNumeric,
    setNombreWifiConectada,
    setmensajeGeneral,
    setActiveProceso,
    setSelectScreen,
    menuWifiConfig,
    setCiclo,
    activarMenuWifi,
    onOnchangeViewKeyBoardNumeric,
    MenssageGeneralContext,
    nombreWifiConectada,
    mensajeGeneral,
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

        <div className="btn-principal">
          <button disabled={activeProceso.activar} onClick={() => setSelectScreen({ manual: true, config: false, auto: false })}>
            MANUAL
          </button>
          <button disabled={activeProceso.activar} onClick={() => {setActiveProceso({ activar: true, proceso: 'lavado' }); setCiclo(0) }}>
            LAVADO
          </button>
          <button disabled={activeProceso.activar} onClick={() => setSelectScreen({ manual: false, config: true, auto: false })}>
            RECIRCULACION
          </button>
          <button disabled={activeProceso.activar} onClick={() => {setSelectScreen({ manual: false, config: false, auto: true }); reiniciarFlujometros()}}>
            MEZCLADO
          </button>
          <button disabled={activeProceso.activar}  onClick={() => setSelectScreen({ manual: true, config: false, auto: false })}>
            TRANSFERIR
          </button>
          <button disabled={activeProceso.activar} onClick={() => setSelectScreen({ manual: false, config: true, auto: false })}>
            CONFIGURACION
          </button>
        </div>

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
      {activarMenuWifi ? <MenuWifi nombreWifiConect={setNombreWifiConectada} /> : null}
      <div className="img-wifi">
        <span>{nombreWifiConectada}</span>
        <img onClick={() => menuWifiConfig()} src={wifi}></img>
      </div>
      {activeProceso.activar ? (
        <div className="cont-proceso-auto">{procesos[activeProceso.proceso][ciclo].html}</div>
      ) : null}
    </MenssageGeneralContext.Provider>
  )
}

export default App
