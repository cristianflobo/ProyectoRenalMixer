import { KeyBoardNumeric } from './components/keyBoardNumeric/KeyBoardNumeric'
import { Message } from './components/message/Message'
import useApp from './hooks/useApp'
import { config, sola } from './images/'
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
    <MenssageGeneralContext.Provider value={{mensajeGeneral, setmensajeGeneral}}>
      <div className="conteiner">
        <img  src={config}></img>
        <button>AUTOMATICO</button>
        <button onClick={() => setSelectScreen({manual:true, config:false})}>MANUAL</button>
        <button onClick={() => setSelectScreen({manual:false, config:true})}>CONFIGURACION</button>
        <img  src={sola}></img>
        {selectScreen.config ? <ConfigMixer closeWindows={setSelectScreen} /> : null}
        {selectScreen.manual ? <Manual closeWindows={setSelectScreen} /> : null}
        {/* <p
          style={{ height: '50px', width: '100px' }}
          onClick={() =>
            setOnOnchangeViewKeyBoardNumeric({ ...onOnchangeViewKeyBoardNumeric, view: true })
          }
        >
          {onOnchangeViewKeyBoardNumeric.data}
        </p> */}
        {onOnchangeViewKeyBoardNumeric.view ? (
          <KeyBoardNumeric setKey={setOnOnchangeViewKeyBoardNumeric} />
        ) : null}
        
        {
          mensajeGeneral.view?<Message/>:null
        }
      </div>
    </MenssageGeneralContext.Provider>
  )
}

export default App
