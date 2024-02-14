import '../../styles/config.css'
import useConfiguration from '@renderer/hooks/useConfiguration'

export function Configuracion({ closeWindows }): JSX.Element {
  const { selectConfig, listInfoMenu } = useConfiguration()
  return (
    <div className="conteiner-config">
      <div>
        <strong>Configuraciones</strong>
      </div>
      <div>
        <div className="menu-bar">
          {listInfoMenu.map((item: infoMenu, i:number) => (
            <button key={i} onClick={(event) => selectConfig(event)} value={item.title}>
              {item.title}
            </button>
          ))}
        </div>
        {listInfoMenu.map((item: infoMenu) => {
          if (item.view) return item.component
          return null
        })}
      </div>
      <button className="btn-back" onClick={() => closeWindows({manua:false, config: false})}>
        ATRAS
      </button>
    </div>
  )
}
