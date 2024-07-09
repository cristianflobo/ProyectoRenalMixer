import useConfigMixer from '@renderer/hooks/useConfigMixer'
import '../../styles/configMixer.css'
import { KeyBoardNumeric } from '@renderer/components/keyBoardNumeric/KeyBoardNumeric'
import { MenuWifi, NavBa } from '@renderer/components'
import wifi from '../../images/wifi.svg'
import DosificacionCajas from '@renderer/components/dosificacionCajas/DosificacionCajas'

export function ConfigMixer({ closeWindows }):JSX.Element {
  const {
    setOnOnchangeViewKeyBoardNumeric,
    setNombreWifiConectada,
    activeKeyBoardNumeric,
    setDosificacionCajas,
    menuWifiConfig,
    selectChange,
    onOnchangeViewKeyBoardNumeric,
    nombreWifiConectada,
    dosificacionCajas,
    activarMenuWifi,
    datosConfig,
    minutos,
    hora
  } = useConfigMixer()

  return (
    <div className="cont-config-mixer">
      <NavBa/>
      <div className="datos-key">
        <div>
          {datosConfig?.map((item: TdataConfig, i: number) => {
            return item.time ? (
              <div className="div-map" key={i}>
                <span style={{fontSize:"20px"}}>{item.title}</span>
                <div style={{ display: 'flex' }}>
                  <div className="label-select">
                    <label>HH</label>
                    <select
                      value={item.hora1}
                      onChange={(event) => selectChange(event, i, 'hora1')}
                    >
                      {hora.map((item: number, i:number) => (
                        <option key={i} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
      
                  <div className="label-select">
                    <label>MM</label>
                    <select
                      value={item.minu2}
                      onChange={(event) => selectChange(event, i, 'minu2')}
                    >
                      {minutos.map((item: number, i:number) => (
                        <option key={i} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="div-map" onClick={() => activeKeyBoardNumeric(i)} key={i}>
                <span style={{fontSize:"20px"}}>{item.title}</span>
                <span>{item.dato}</span>
              </div>
            )
          })}
          <div className="div-map" onClick={() => setDosificacionCajas(true)}>
                <span style={{fontSize:"20px"}}>DOSIFICACION CAJAS</span>
  
              </div>
          {
            dosificacionCajas?<DosificacionCajas cerrar ={setDosificacionCajas}/>:null
          }
        </div>
        {activarMenuWifi ? <MenuWifi nombreWifiConect={setNombreWifiConectada} /> : null}
      <div className="img-wifi">
        <span>{nombreWifiConectada}</span>
        <img onClick={() => menuWifiConfig()} src={wifi}></img>
      </div>
        <div>
          {onOnchangeViewKeyBoardNumeric.view ? (
            <KeyBoardNumeric setKey={setOnOnchangeViewKeyBoardNumeric} />
          ) : null}
        </div>
      </div>
      <div>
        <button className="btn-back" onClick={() => closeWindows({ manua: false, config: false })}>ATRAS</button>
      </div>
    </div>
  )
}
