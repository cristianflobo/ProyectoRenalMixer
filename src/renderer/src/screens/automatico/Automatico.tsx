import { KeyBoardNumeric } from '@renderer/components/keyBoardNumeric/KeyBoardNumeric'
import useAutomatico from '@renderer/hooks/useAutomatico'
import '../../styles/automatico.css'
import { NavBa, VisuaizarGpioAccion } from '@renderer/components'

export function Automatico({datosSerial, closeWindows }): JSX.Element {
  const {
    setOnOnchangeViewKeyBoardNumeric,
    activeKeyBoardNumeric,
    setActiveProceso,
    onOnchangeViewKeyBoardNumeric,
    procesoAutomatico,
    activeProceso,
    botonAtras,
    renderData,
    ciclo
  } = useAutomatico(datosSerial, closeWindows)
  return (
    <div className="cont-automatico">
      <NavBa />
      <div className="padre-auto">
        <div>
          <button disabled={activeProceso} className="btn-back" onClick={() => setActiveProceso(!activeProceso)}>
            INICIAR
          </button>
        </div>
        <div className='litros-tanque'>
          <div>
            <span>{datosSerial.dataSerial1}L</span>    
            <div style={{ backgroundColor:"blue",width:"100%", height:`${(datosSerial.dataSerial1*255)/500}px`}}>
            </div>
          </div>
        </div>
        <div><VisuaizarGpioAccion gpioActivos={procesoAutomatico[ciclo].procesoGpio}/></div>
        <div>
          <div>
            {renderData.map((item, i: number) => (
              <div className="div-map" key={i} onClick={() => activeKeyBoardNumeric(i)}>
                <span style={{fontSize:"17px"}}>{item.title}</span>
                <span>{item.dato}</span>
              </div>
            ))}
          </div>
          <div className="calc-auto">
            {onOnchangeViewKeyBoardNumeric.view ? (
              <KeyBoardNumeric setKey={setOnOnchangeViewKeyBoardNumeric} />
            ) : null}
          </div>
        </div>
      </div>
      <div className="boton-abajo">
        <button
          className="btn-back"
          onClick={() => botonAtras()}
        >
          ATRAS
        </button>
      </div>
      {activeProceso ? <div className="cont-proceso-auto" style={{display:`${procesoAutomatico[ciclo].display}`}}>{procesoAutomatico[ciclo].html}</div>: null}
    </div>
  )
}
