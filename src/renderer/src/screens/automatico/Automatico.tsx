import { KeyBoardNumeric } from '@renderer/components/keyBoardNumeric/KeyBoardNumeric'
import useAutomatico from '@renderer/hooks/useAutomatico'
import '../../styles/automatico.css'
import { ProcesoAuto } from '@renderer/components/procesoAuto/procesoAuto'

export function Automatico({ closeWindows }) {
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
      <div>
        <div>
          {renderData.map((item, i: number) => (
            <div className="div-map" key={i} onClick={() => activeKeyBoardNumeric(i)}>
              <span>{item.title}</span>
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
      <div className="boton-abajo">
        <button onClick={() => setActiveProceso(!activeProceso)}>
          INICIO
        </button>
        <button
          onClick={() => closeWindows({ manual: false, config: false, auto: false })}
          
        >
          ATRAS
        </button>
      </div>

      {activeProceso ? <ProcesoAuto  datos={renderData} returnHome={closeWindows}/> : null}
    </div>
  )
}
