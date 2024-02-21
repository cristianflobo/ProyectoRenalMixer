import useProcesoAuto from "@renderer/hooks/useProcesoAuto"

export function ProcesoAuto(): JSX.Element  {
   const { pasosProcesos, litrosSerial} = useProcesoAuto()
      return (
        <div className="cont-proceso-auto" >
            <h3>s1 {litrosSerial.s1}</h3>
            <h3>s1 {litrosSerial.s2}</h3>
        </div>      
      )
      
  }