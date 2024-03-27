import useProcesoAuto from '@renderer/hooks/useProcesoAuto'

export function ProcesoAuto({ returnHome, nombreProceso }): JSX.Element {
  const { procesos, ciclo } = useProcesoAuto(nombreProceso, returnHome)
  console.log(procesos[nombreProceso][0].html)
  return <div className="cont-proceso-auto">{procesos[nombreProceso][ciclo].html}</div>
}
