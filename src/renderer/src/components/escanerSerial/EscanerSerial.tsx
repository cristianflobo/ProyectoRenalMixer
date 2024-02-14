import useEscaner from '../../hooks/useEscaner'
import '../../styles/scann.css'

export function EscanerSerial(): JSX.Element {
  const { conexionPueroSerial, desconectar,onChangeSelect, escanear, serialPortArray, selectBaudios, puertos } = useEscaner()

  return (
    <div className="cont-port-serial">
      <button onClick={() => escanear()}>Buscar</button>
      <div className="cont-list-port">
        <div className="lista-puertos">
          <strong>Conectar</strong>
          <hr></hr>
          <select onChange={(event)=>onChangeSelect(event)}>
            {
              selectBaudios.map((item:SelectBaudios, i:number)=> <option key={i} value={item.baudio}>{item.baudio} Baud</option>)
            }
          </select>
          {puertos
            ? puertos.map((item: any, i: number) => (
                <button className='btn-serial' value={item.path} onClick={(event) => conexionPueroSerial(event)} key={i}>
                  {item.path}
                </button>
              ))
            : null}
        </div>
        <hr></hr>
        <div>
          <strong>Desconectar</strong>
          <hr></hr>
          {serialPortArray != undefined && serialPortArray.length > 0
            ? serialPortArray.map((item: objDataPort, i: number) => (
                <button className='btn-serial' key={i} value={item.path} onClick={(event) => desconectar(event)}>
                  {item.path} - {item.baudRate}
                </button>
              ))
            : null}
        </div>
      </div>
    </div>
  )
}
