import { useEffect, useState } from 'react'

const useConfigMixer = () => {
  const [datosConfig, setDatosConfig] = useState<TdataConfig[] | null>()
  const [posicionDataConfig, setposicionDataConfig] = useState(0)
  const [onOnchangeViewKeyBoardNumeric, setOnOnchangeViewKeyBoardNumeric] = useState({
    view: false,
    data: ''
  })
  let hora: number[] = []
  for (let i = 0; i < 24; i++) {
    hora.push(i)
  }
  let minutos: number[] = []
  for (let i = 0; i < 60; i++) {
    minutos.push(i)
  }
  useEffect(() => {
    let configDatos = localStorage.getItem('configDatos')
    if (configDatos) {
      console.log(configDatos)
      setDatosConfig(JSON.parse(configDatos))
    } else {
      localStorage.setItem(
        'configDatos',
        JSON.stringify([
          {
            title: 'TIEMPO DE MEZCLADO',
            dato: 0,
            time: false
          },
          {
            title: 'HORA INICIO DISTRIBUCIÓN',
            dato: 0,
            time: true
          },
          {
            title: 'HORA FINAL DISTRIBUCIÓN',
            dato: 0,
            time: true
          },
          {
            title: 'FACTOR DE CALIBRACION',
            dato: 0,
            time: false
          }
        ])
      )
      let data = localStorage.getItem('configDatos')
      setDatosConfig(JSON.parse(data!))
    }
    return () => {}
  }, [])
  useEffect(() => {
    let configDatos = JSON.parse(localStorage.getItem('configDatos')!)
    if (onOnchangeViewKeyBoardNumeric.data !== '' && !onOnchangeViewKeyBoardNumeric.view) {
      configDatos = JSON.parse(localStorage.getItem('configDatos')!)
      let dataKeyTermporal = configDatos?.map((item: TdataConfig, i: number) => {
        if (i === posicionDataConfig) return { ...item, dato: onOnchangeViewKeyBoardNumeric.data }
        return item
      })
      localStorage.setItem('configDatos', JSON.stringify(dataKeyTermporal))
      console.log(configDatos, dataKeyTermporal)
      setDatosConfig(dataKeyTermporal)
    } else {
      setDatosConfig(configDatos)
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
    onOnchangeViewKeyBoardNumeric,
    datosConfig,
    minutos,
    hora
  }
}

export default useConfigMixer
