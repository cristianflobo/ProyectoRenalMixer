import useConfigMixer from '@renderer/hooks/useConfigMixer'
import '../../styles/configMixer.css'
import { KeyBoardNumeric } from '@renderer/components/keyBoardNumeric/KeyBoardNumeric'

export function ConfigMixer({ closeWindows }) {
  const {
    activeKeyBoardNumeric,
    setOnOnchangeViewKeyBoardNumeric,
    onOnchangeViewKeyBoardNumeric,
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
                <select >
                  {hora.map((item: number) => (
                    <option value={item}>{item}</option>
                  ))}
                </select>
                <span>:</span>
                <select >
                  {minutos.map((item: number) => (
                    <option value={item}>{item}</option>
                  ))}
                </select>
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
