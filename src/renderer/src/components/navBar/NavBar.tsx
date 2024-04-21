import { sola } from '@renderer/images/index'
import { ClockTime } from '../clockTime/Clock'
import '../../styles/navBar.css'
import { useEffect, useState } from 'react'

export function NavBa(): JSX.Element {
  const [nombrePlanta, setNombrePlanta] = useState({activo:false, nombre:"Nombre"})

  useEffect(() => {
    const nombrePlantaStorage = localStorage.getItem('nombrePlanta')
    const casa = localStorage.getItem('casa')
    console.log(casa)
    if(nombrePlantaStorage === null){
      localStorage.setItem('nombrePlanta', 'Nombre')
    }else {
      setNombrePlanta({...nombrePlanta, nombre:nombrePlantaStorage!})
    }
  
    return () => {
    }
  }, [])
  
  
  const cambioAInput = ():void => {
    setNombrePlanta({...nombrePlanta, activo:true})
  }

  const setearNombrePlanta =():void => {
    setNombrePlanta({nombre:nombrePlanta.nombre, activo:!nombrePlanta.activo})
    localStorage.setItem('nombrePlanta', nombrePlanta.nombre)
  }
  return (
    <div className="navBar">
      <ClockTime />
      <div className='sola'>
        <img style={{ width: '200px', height: '100px' }} src={sola}></img>
      </div>
      <div className='rtc'>
        <div onClick={()=>cambioAInput()}>
          <strong>RTS S.A.S</strong>
          {nombrePlanta.activo?
          <input value={nombrePlanta.nombre} onBlur={()=> setearNombrePlanta() } onChange={(e)=> setNombrePlanta({...nombrePlanta, nombre:e.target.value})} placeholder='ingresar nombre'></input>:
            <strong >{nombrePlanta.nombre}</strong>}
        </div>
      </div>
    </div>
  )
}
