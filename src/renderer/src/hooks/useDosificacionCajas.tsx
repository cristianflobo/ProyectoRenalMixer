import { useEffect, useState } from "react"


const useDosificacionCajas = () => {
    const [datosCajas, setdatosCajas] = useState<Tcajas[]>([])

    useEffect(() => {
        const datos = localStorage.getItem("datosCajas")
        if(!datos!){
            localStorage.setItem("datosCajas", JSON.stringify([
                {title:"Una caja", aguaFinal:0, aguaPolvo:0},
                {title:"Dos caja", aguaFinal:0, aguaPolvo:0},
                {title:"Tres caja", aguaFinal:0, aguaPolvo:0},
                {title:"Cuatro caja", aguaFinal:0, aguaPolvo:0},
                {title:"Cinco caja", aguaFinal:0, aguaPolvo:0},
            ]))
        }else {
            setdatosCajas(JSON.parse(localStorage.getItem("datosCajas") || ""))
        }  
      return () => {
      }
    }, [])

    const formDatosDosificacion =(e, i:number) =>{
      let datosCajasSto = JSON.parse(localStorage.getItem("datosCajas") || "")
      datosCajasSto[i][e.target.name] = e.target.value
      localStorage.setItem("datosCajas", JSON.stringify(datosCajasSto))
      setdatosCajas(datosCajasSto)
    }
  return {
    formDatosDosificacion,
    datosCajas
  }
}

export default useDosificacionCajas