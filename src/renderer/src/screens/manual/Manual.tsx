import useManual from '@renderer/hooks/useManual'
import '../../styles/manual.css'

export function Manual({ closeWindows }) {
  const { changeIo, selectIo } = useManual()
  return (
    <div className="cont-manual">
      <div>
        {selectIo?.map((item: TioPeripheral, i: number) => (
          <button
            style={item.estado === 0 ? { backgroundColor: 'black' } : { backgroundColor: 'green' }}
            onClick={(event) => changeIo(event)}
            key={i}
            value={item.nombre}
          >
            {item.nombre} <br></br> {item.estado === 0 ? 'OFF' : 'ON'}
          </button>
        ))}
      </div>
      <div>
        <button className="btn-back" onClick={() => closeWindows({ manua: false, config: false })}>
          ATRAS
        </button>
      </div>
    </div>
  )
}
