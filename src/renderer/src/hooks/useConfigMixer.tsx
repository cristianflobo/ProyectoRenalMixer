import { ChangeEvent, useEffect, useState } from 'react'

const useConfigMixer = () => {
  const [datosConfig, setDatosConfig] = useState<TdataConfig[] | null>()
  const [posicionDataConfig, setposicionDataConfig] = useState(0)
  const [activarMenuWifi, setActivarMenuWifi] = useState(false)
  const [nombreWifiConectada, setNombreWifiConectada] = useState('no Connected')
  const [onOnchangeViewKeyBoardNumeric, setOnOnchangeViewKeyBoardNumeric] = useState({
    view: false,
    data: ''
  })
  const hora: number[] = []
  for (let i = 0; i < 24; i++) {
    hora.push(i)
  }
  const minutos: number[] = []
  for (let i = 0; i < 60; i++) {
    minutos.push(i)
  }
  useEffect(() => {
    const configDatos = localStorage.getItem('configDatos')
    if (configDatos) {
      const buscar = JSON.parse(configDatos!).find(
        (item) => item.title === 'TIEMPO DRENADO EN LAVADO (SEG)'
      )
      if (buscar) {
        setDatosConfig(JSON.parse(configDatos))
      } else {
        localStorage.setItem(
          'configDatos',
          JSON.stringify([
            {
              title: 'TIEMPO DE MEZCLADO (MIN)',
              dato: 0,
              time: false
            },
            {
              title: 'HORA INICIO DISTRIBUCIÓN',
              hora1: 0,
              minu2: 0,
              time: true
            },
            {
              title: 'HORA FINAL DISTRIBUCIÓN',
              hora1: 0,
              minu2: 0,
              time: true
            },
            {
              title: 'FACTOR DE CALIBRACION S1',
              dato: 0,
              time: false
            },
            {
              title: 'FACTOR DE CALIBRACION S2',
              dato: 0,
              time: false
            },
            {
              title: 'TIEMPO LAVADO (MIN)',
              dato: 0,
              time: false
            },
            {
              title: 'CANTIDAD DE AGUA LAVADO (L)',
              dato: 0,
              time: false
            },
            {
              title: 'TIEMPO DRENADO PRELIMINAR (SEG)',
              dato: 0,
              time: false
            },
            {
              title: 'TIEMPO DRENADO EN LAVADO (SEG)',
              dato: 0,
              time: false
            }
          ])
        )
        const data = localStorage.getItem('configDatos')
        setDatosConfig(JSON.parse(data!))
      }
    } else {
      localStorage.setItem(
        'configDatos',
        JSON.stringify([
          {
            title: 'TIEMPO DE MEZCLADO (MIN)',
            dato: 0,
            time: false
          },
          {
            title: 'HORA INICIO DISTRIBUCIÓN',
            hora1: 0,
            minu2: 0,
            time: true
          },
          {
            title: 'HORA FINAL DISTRIBUCIÓN',
            hora1: 0,
            minu2: 0,
            time: true
          },
          {
            title: 'FACTOR DE CALIBRACION S1',
            dato: 0,
            time: false
          },
          {
            title: 'FACTOR DE CALIBRACION S2',
            dato: 0,
            time: false
          },
          {
            title: 'TIEMPO LAVADO (MIN)',
            dato: 0,
            time: false
          },
          {
            title: 'CANTIDAD DE AGUA LAVADO (L)',
            dato: 0,
            time: false
          },
          {
            title: 'TIEMPO DRENADO PRELIMINAR (SEG)',
            dato: 0,
            time: false
          },
          {
            title: 'TIEMPO DRENADO EN LAVADO (SEG)',
            dato: 0,
            time: false
          }
        ])
      )
      const data = localStorage.getItem('configDatos')
      setDatosConfig(JSON.parse(data!))
    }
    return (): void => {}
  }, [])

  useEffect(() => {
    let configDatos = JSON.parse(localStorage.getItem('configDatos')!)
    if (onOnchangeViewKeyBoardNumeric.data !== '' && !onOnchangeViewKeyBoardNumeric.view) {
      configDatos = JSON.parse(localStorage.getItem('configDatos')!)
      const dataKeyTermporal = configDatos?.map((item: TdataConfig, i: number) => {
        if (i === posicionDataConfig) return { ...item, dato: onOnchangeViewKeyBoardNumeric.data }
        return item
      })
      localStorage.setItem('configDatos', JSON.stringify(dataKeyTermporal))

      setDatosConfig(dataKeyTermporal)
    } else {
      setDatosConfig(configDatos)
    }

    if (configDatos[posicionDataConfig].title.includes('FACTOR DE CALIBRACION')) {
      window.electron.ipcRenderer.send('enviarFactorK', {
        data: onOnchangeViewKeyBoardNumeric.data,
        serial: configDatos[posicionDataConfig].title.includes('S1') ? 0 : 1
      })
    }

    return (): void => {}
  }, [onOnchangeViewKeyBoardNumeric.view])

  const activeKeyBoardNumeric = (posicion: number):void => {
    setposicionDataConfig(posicion)
    setOnOnchangeViewKeyBoardNumeric({ ...onOnchangeViewKeyBoardNumeric, view: true })
  }
  const selectChange = (
    event: ChangeEvent<HTMLSelectElement>,
    id: number,
    fieldName: string
  ): void => {
    console.log(id)
    const { value } = event.target
    const changeValue = datosConfig?.map((item, i) => {
      if (id == i) {
        item[fieldName] = value
      }
      return item
    })
    localStorage.setItem('configDatos', JSON.stringify(changeValue))
    setDatosConfig(changeValue)
    window.electron.ipcRenderer.send('configDistribucionDiaria', { id, datos: changeValue![id] })
  }

  const menuWifiConfig = (): void => {
    setActivarMenuWifi((pre) => !pre)
  }

  return {
    setOnOnchangeViewKeyBoardNumeric,
    setNombreWifiConectada,
    activeKeyBoardNumeric,
    menuWifiConfig,
    selectChange,
    onOnchangeViewKeyBoardNumeric,
    nombreWifiConectada,
    activarMenuWifi,
    datosConfig,
    minutos,
    hora
  }
}

export default useConfigMixer
