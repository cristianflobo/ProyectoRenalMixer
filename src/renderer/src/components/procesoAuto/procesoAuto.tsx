import useProcesoAuto from '@renderer/hooks/useProcesoAuto'

export function ProcesoAuto({ datos, returnHome }): JSX.Element {
  const { pasosProcesos, litrosSerial, ciclo } = useProcesoAuto(datos, returnHome)
  console.log(pasosProcesos[0].html)
  return <div className="cont-proceso-auto">{pasosProcesos[ciclo].html}</div>
}
