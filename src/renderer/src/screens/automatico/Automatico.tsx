import useAutomatico from '@renderer/hooks/useAutomatico'
import '../../styles/automatico.css'
import { NavBa, VisuaizarGpioAccion } from '@renderer/components'

export function Automatico({ datosSerial, closeWindows }): JSX.Element {
  const {
    setActiveProceso,
    seleccionCaja,
    setCiclo,
    seleccionCajaState,
    procesoAutomatico,
    mensajesAlertas,
    mensajeAlerta,
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
          <button
            disabled={activeProceso}
            className="btn-back"
            onClick={() => {
              setActiveProceso(!activeProceso)
              setCiclo(0)
            }}
          >
            INICIAR
          </button>
        </div>
        <div className="litros-tanque">
          <div>
            <span>{datosSerial.dataSerial1}L</span>
            <div
              style={{
                backgroundColor: 'blue',
                width: '100%',
                height: `${(datosSerial.dataSerial1 * 255) / 500}px`
              }}
            ></div>
          </div>
        </div>
        <div>
          {ciclo >= 0 ? (
            <VisuaizarGpioAccion gpioActivos={procesoAutomatico[ciclo].procesoGpio} />
          ) : null}
        </div>
        <div className='datos-cajas'>
          <div>
            <select disabled={activeProceso} onChange={(e)=>seleccionCaja(e)}>
              {renderData.map((item, i: number) => (
                <option key={i}>{item.title}</option>
              ))}
            </select>
          </div>
          <div>
          {/* seleccionCajaState */}
              <div className="div-map">
                <span style={{ fontSize: '17px' }}>CANTIDAD DE AGUA FINAL {seleccionCajaState?.aguaFinal}L</span>
                {/* <span>{seleccionCajaState.}</span> */}
              </div>
              <div className="div-map">
                <span style={{ fontSize: '17px' }}>CANTIDAD DE AGUA PARA AGREGAR POLVO {seleccionCajaState?.aguaPolvo}L</span>
                {/* <span>{seleccionCajaState.}</span> */}
              </div>
              
          </div>
        </div>
      </div>
      <div className="boton-abajo">
        <button className="btn-back" onClick={() => botonAtras()}>
          ATRAS
        </button>
      </div>
      {activeProceso ? (
        <div
          className="cont-proceso-auto"
          style={{ display: `${procesoAutomatico[ciclo].display}` }}
        >
          {procesoAutomatico[ciclo].html}
        </div>
      ) : null}
      {mensajeAlerta !== -1 ? (
        <div
          className="cont-proceso-auto"
        >
          {mensajesAlertas[mensajeAlerta].html}
        </div>
      ) : null}
    </div>
  )
}
