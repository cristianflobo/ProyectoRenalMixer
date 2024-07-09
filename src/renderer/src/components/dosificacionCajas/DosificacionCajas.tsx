import useDosificacionCajas from '@renderer/hooks/useDosificacionCajas'
import '../../styles/dosificacionCajas.css'

function DosificacionCajas({ cerrar }) {
  const {formDatosDosificacion, datosCajas } = useDosificacionCajas()
  return (
    <div className="conte-dosi">
      <div>
        <strong style={{ marginBottom: '20px' }}>DATOS PREPARAR CAJAS EN LITROS</strong>
      </div>
      <div >
        {datosCajas.length > 0?datosCajas.map((item, i) => (
          <div  key={i} className="cont-datos">
            <span>{item.title}</span>
            <input onChange={(e)=>formDatosDosificacion(e, i)} value={item.aguaFinal} type="number"  name='aguaFinal'  placeholder="AGUA FINAL" />
            <input onChange={(e)=>formDatosDosificacion(e, i)} value={item.aguaPolvo} type="number" name='aguaPolvo' placeholder="AGUA POLVO" />
          </div>
        )):null
        }
      </div>
      <div >
        <button onClick={() => cerrar(false)}>
          Cerrar
        </button>
      </div>
    </div>
  )
}

export default DosificacionCajas
