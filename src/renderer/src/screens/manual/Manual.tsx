import useManual from '@renderer/hooks/useManual'
import '../../styles/manual.css'
import { NavBa } from '@renderer/components'

export function Manual({ closeWindows }): JSX.Element {
  const { changeIo, selectIo } = useManual()
  return (
    <div className="cont-manual">
      <NavBa/>
      <div className='cont-btn-manual'>
        {selectIo?.map((item: TioPeripheral, i: number) => (
          <button
            style={item.estado === 0 ? { backgroundColor: '#0491d7' } : { backgroundColor: 'green' }}
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
