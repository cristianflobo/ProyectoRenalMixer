/* eslint-disable react/prop-types */
import useHookShared from '@renderer/hooks/useHookShared'
import { GeneradorSVG } from '../generadorSVG/GeneradorSVG'
import '../../styles/visuaizarGpioAccion.css'

export function VisuaizarGpioAccion({ gpioActivos }): JSX.Element {
  const { datosGpio } = useHookShared()
  return (
    <div className='cont-visual-gpio'>
      {datosGpio.map((item, i: number) => {gpioActivos
        const buscar = gpioActivos.find((item2) => item.nombre == item2.nombre)
        if (buscar === undefined) {
          return (
            <div key={i}>
                <span>{item.nombre}</span>
              <GeneradorSVG color={'#0491d7'} />
            </div>
          )
        } else {
          return (
            <div key={i}>
                 <span>{item.nombre}</span>
              <GeneradorSVG color={"green"} />
            </div>
          )
        }
      })}
    </div>
  )
}
