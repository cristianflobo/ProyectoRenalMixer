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
            <span onClick={() => ingresarDatos()}>{item.ssid}</span>
            {activarInput ? (
              <div>
                <input value={contrasena} onChange={(e)=>setContrasena(e.target.value)} placeholder="contrasena">
                  {' '}
                  <button onClick={() => conectarWifi(item.ssid)}>Conectar</button>
                </input>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
