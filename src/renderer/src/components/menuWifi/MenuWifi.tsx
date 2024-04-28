import useMenuWifi from '@renderer/hooks/useMenuWifi'
import '../../styles/menuWifi.css'

export function MenuWifi({nombreWifiConect}): JSX.Element {
  const { setContrasena, ingresarDatos, conectarWifi, contrasena, listaWifi, activarInput } =
    useMenuWifi(nombreWifiConect)
  return (
    <div className="menu-wifi">
      <div>
        {listaWifi!.map((item: Twifi, i: number) => (
          <div key={i}>
            <span onClick={() => ingresarDatos(item.ssid)}>{item.ssid} {item.frequency > 3000? "5Hz":"2.4Hz"}</span>
            {activarInput.activar && activarInput.ssid === item.ssid ? (
              <div>
                <input value={contrasena} onChange={(e)=>setContrasena(e.target.value)} placeholder="contrasena"></input>
                <button className='btn-wifi' onClick={() => conectarWifi(item.ssid)}>Conectar</button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
