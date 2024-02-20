import { useEffect, useState } from 'react'

const useAutomatico = () => {
  const [posicionDataConfig, setposicionDataConfig] = useState(0)
  const [onOnchangeViewKeyBoardNumeric, setOnOnchangeViewKeyBoardNumeric] = useState({
    view: false,
    data: ''
  })
  const [renderData, setrenderData] = useState<TdataRenderAuto[]>([])
  const [activeProceso, setActiveProceso] = useState(false)
  useEffect(() => {
    setrenderData([
      {
        title: 'CANTIDAD DE AGUA L',
        dato: 0
      },
      {
        title: 'CANTIDAD DE AGUA PARA AGREGAR POLVO',
        dato: 0
      }
    ])
    return () => {}
  }, [])

  useEffect(() => {
    if (onOnchangeViewKeyBoardNumeric.data !== '' && !onOnchangeViewKeyBoardNumeric.view) {
      let dataKeyTermporal = renderData?.map((item: TdataRenderAuto, i: number) => {
        if (i === posicionDataConfig)
          return { ...item, dato: parseInt(onOnchangeViewKeyBoardNumeric.data) }
        return item
      })
      setrenderData(dataKeyTermporal)
    }
    return () => {}
  }, [onOnchangeViewKeyBoardNumeric.view])
  const activeKeyBoardNumeric = (posicion: number) => {
    setposicionDataConfig(posicion)
    setOnOnchangeViewKeyBoardNumeric({ ...onOnchangeViewKeyBoardNumeric, view: true })
  }
  return {
    setOnOnchangeViewKeyBoardNumeric,
    activeKeyBoardNumeric,
    setActiveProceso,
    onOnchangeViewKeyBoardNumeric,
    activeProceso,
    renderData
  }
}

export default useAutomatico
