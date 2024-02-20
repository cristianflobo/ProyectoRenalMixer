import { ClockTime } from './components/clockTime/Clock'
import { KeyBoardNumeric } from './components/keyBoardNumeric/KeyBoardNumeric'
import { Message } from './components/message/Message'
import useApp from './hooks/useApp'
import { config, sola } from './images/'
import { Automatico } from './screens/automatico/Automatico'
import { ConfigMixer } from './screens/configMixer/ConfigMixer'
import { Manual } from './screens/manual/Manual'

function App(): JSX.Element {
  const {
    setOnOnchangeViewKeyBoardNumeric,
    setmensajeGeneral,
    setSelectScreen,
    onOnchangeViewKeyBoardNumeric,
    MenssageGeneralContext,
    mensajeGeneral,
    selectScreen
  } = useApp()
  console.log(selectScreen)
  return (
    <MenssageGeneralContext.Provider value={{ mensajeGeneral, setmensajeGeneral }}>
      <div className="conteiner">
        <ClockTime />
        <img src={config}></img>
        <button onClick={() => setSelectScreen({ manual: false, config: false, auto: true })}>
          AUTOMATICO
        </button>
        <button onClick={() => setSelectScreen({ manual: true, config: false, auto: false })}>
          MANUAL
        </button>
        <button onClick={() => setSelectScreen({ manual: false, config: true, auto: false })}>
          CONFIGURACION
        </button>
        <img src={sola}></img>
        {selectScreen.config ? <ConfigMixer closeWindows={setSelectScreen} /> : null}
        {selectScreen.manual ? <Manual closeWindows={setSelectScreen} /> : null}
        {selectScreen.auto ? <Automatico closeWindows={setSelectScreen} /> : null}
        {onOnchangeViewKeyBoardNumeric.view ? (
          <KeyBoardNumeric setKey={setOnOnchangeViewKeyBoardNumeric} />
        ) : null}

        {mensajeGeneral.view ? <Message /> : null}
      </div>
    </MenssageGeneralContext.Provider>
  )
}

export default App
