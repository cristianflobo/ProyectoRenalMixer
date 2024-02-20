import { useEffect, useState } from 'react'

const useProcesoAuto = () => {
    const [pasosProcesos, setPasosProcesos] = useState<any>()
    useEffect(() => {
      setPasosProcesos([
        {
          id: 0,
          title: '',
          descripcion: 'llenar primera parte',
          activo: false,
          procesoPines: [{}]
        }
      ])
      return () => {}
    }, [])
  return {
    pasosProcesos
  }
}

export default useProcesoAuto