/* eslint-disable react/prop-types */
import useHookShared from '@renderer/hooks/useHookShared'
import { GeneradorSVG } from '../generadorSVG/GeneradorSVG'
import '../../styles/visuaizarGpioAccion.css'

export function VisuaizarGpioAccion({ gpioActivos }): JSX.Element {
  const { datosGpio } = useHookShared()
  console.log(gpioActivos)
  
  return (
    <div className='cont-visual-gpio'>
      {datosGpio.map((item, i: number) => {
        const buscar = gpioActivos.find((item2) => item.nombre == item2)
        if (buscar === undefined) {
          console.log(buscar)
          return (
            <div className='padre-svg' key={i}>
                <span>{item.nombre}</span>
              <GeneradorSVG color={'#0491d7'} />
            </div>
          )
        } else {
          return (
            <div className='padre-svg' key={i}>
                 <span>{item.nombre}</span>
              <GeneradorSVG color={"green"} />
            </div>
          )
        }
      })}
    </div>
  )
}
