import useProcesoAuto from "@renderer/hooks/useProcesoAuto"

export function ProcesoAuto(): JSX.Element  {
   const { prenderApagar,pasosProcesos, litrosSerial} = useProcesoAuto()
      return (
        <div className="cont-proceso-auto" >
            <h1>s1 {litrosSerial.s1}</h1>
            <h1>s1 {litrosSerial.s2}</h1>
          <button onClick={()=>prenderApagar("p")}>PRENDER</button>
          <button onClick={()=>prenderApagar("a")}>APAGAR</button>
        </div>      
      )
      
  }