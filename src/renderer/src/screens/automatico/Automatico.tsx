import { KeyBoardNumeric } from '@renderer/components/keyBoardNumeric/KeyBoardNumeric'
import useAutomatico from '@renderer/hooks/useAutomatico'
import '../../styles/automatico.css'
import { ProcesoAuto } from '@renderer/components/procesoAuto/procesoAuto'
import { NavBa } from '@renderer/components'

export function Automatico({ closeWindows }: () => void): JSX.Element {
  const {
    setOnOnchangeViewKeyBoardNumeric,
    activeKeyBoardNumeric,
    setActiveProceso,
    onOnchangeViewKeyBoardNumeric,
    activeProceso,
    renderData
  } = useAutomatico()
  return (
    <div className="cont-automatico">
      <NavBa />
      <div className="padre-auto">
        <div>
          <button className="btn-back" onClick={() => setActiveProceso(!activeProceso)}>
            INICIO
          </button>
        </div>
        <div>Litros</div>
        <div>Valvulas</div>
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
          onClick={() => closeWindows({ manual: false, config: false, auto: false })}
        >
          ATRAS
        </button>
      </div>
      {activeProceso ? <ProcesoAuto datos={renderData} returnHome={closeWindows} /> : null}
    </div>
  )
}
