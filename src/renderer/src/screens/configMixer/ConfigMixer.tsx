import useConfigMixer from '@renderer/hooks/useConfigMixer'
import '../../styles/configMixer.css'
import { KeyBoardNumeric } from '@renderer/components/keyBoardNumeric/KeyBoardNumeric'

export function ConfigMixer({ closeWindows }) {
  const {
    setOnOnchangeViewKeyBoardNumeric,
    activeKeyBoardNumeric,
    selectChange,
    onOnchangeViewKeyBoardNumeric,
    //selectedValue,
    datosConfig,
    minutos,
    hora
  } = useConfigMixer()

  return (
    <div className="cont-config-mixer">
      <div className="datos-key">
        <div>
          {datosConfig?.map((item: TdataConfig, i: number) => {
            return item.time ? (
              <div className="div-map" key={i}>
                <span>{item.title}</span>
                <div style={{ display: 'flex' }}>
                  <div className="label-select">
                    <label>Hora</label>
                    <select
                      value={item.hora1}
                      onChange={(event) => selectChange(event, i, 'hora1')}
                    >
                      {hora.map((item: number) => (
                        <option value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
      
                  <div className="label-select">
                    <label>Minu</label>
                    <select
                      value={item.minu2}
                      onChange={(event) => selectChange(event, i, 'minu2')}
                    >
                      {minutos.map((item: number) => (
                        <option value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="div-map" onClick={() => activeKeyBoardNumeric(i)} key={i}>
                <span>{item.title}</span>
                <span>{item.dato}</span>
              </div>
            )
          })}
        </div>
        <div>
          {onOnchangeViewKeyBoardNumeric.view ? (
            <KeyBoardNumeric setKey={setOnOnchangeViewKeyBoardNumeric} />
          ) : null}
        </div>
      </div>
      <div>
        <button onClick={() => closeWindows({ manua: false, config: false })}>ATRAS</button>
      </div>
    </div>
  )
}
