import { MenuWifi, KeyBoardNumeric, Message, NavBa, FullKeyBoard } from './components/'
import useApp from './hooks/useApp'
import { Automatico } from './screens/automatico/Automatico'
import { ConfigMixer } from './screens/configMixer/ConfigMixer'
import { Manual } from './screens/manual/Manual'
import wifi from './images/wifi.svg'
import x from './images/x.svg'

function App(): JSX.Element {
  const {
    setOnOnchangeViewKeyBoardNumeric,
    setNombreWifiConectada,
    setmensajeGeneral,
    setSelectScreen,
    menuWifiConfig,
    activarMenuWifi,
    onOnchangeViewKeyBoardNumeric,
    MenssageGeneralContext,
    mensajeGeneral,
    selectScreen,
    nombreWifiConectada
  } = useApp()
  console.log(selectScreen)
  return (
    <MenssageGeneralContext.Provider value={{ mensajeGeneral, setmensajeGeneral }}>
      <div className="conteiner">
        
        <NavBa/>
        
        <div className='btn-principal'>
          <button onClick={() => setSelectScreen({ manual: true, config: false, auto: false })}>
            MANUAL
          </button>
          <button onClick={() => setSelectScreen({ manual: true, config: false, auto: false })}>
            LAVADO
          </button>
          <button onClick={() => setSelectScreen({ manual: false, config: true, auto: false })}>
            RECIRCULACION
          </button>
          <button onClick={() => setSelectScreen({ manual: false, config: false, auto: true })}>
            MEZCLADO
          </button>
          <button onClick={() => setSelectScreen({ manual: true, config: false, auto: false })}>
            TRASPASO
          </button>
          <button onClick={() => setSelectScreen({ manual: false, config: true, auto: false })}>
            CONFIGURACION
          </button>
        </div>
     
        {selectScreen.config ? <ConfigMixer closeWindows={setSelectScreen} /> : null}
        {selectScreen.manual ? <Manual closeWindows={setSelectScreen} /> : null}
        {selectScreen.auto ? <Automatico closeWindows={setSelectScreen} /> : null}
        {onOnchangeViewKeyBoardNumeric.view ? (
          <KeyBoardNumeric setKey={setOnOnchangeViewKeyBoardNumeric} />
        ) : null}

        {mensajeGeneral.view ? <Message /> : null}
      </div>
      {activarMenuWifi ? <MenuWifi nombreWifiConect ={setNombreWifiConectada} /> : null}
      <div className="img-wifi">
        <span>{nombreWifiConectada}</span>
        <img onClick={() => menuWifiConfig()}  src={wifi}></img>
      </div>
      {/* <FullKeyBoard/> */}
    </MenssageGeneralContext.Provider>
  )
}

export default App
