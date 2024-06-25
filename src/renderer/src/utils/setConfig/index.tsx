let infoConfig = [
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
]

export function getConfig() {
  let config = JSON.parse(localStorage.getItem('configDatos')!)
  if (!config) {
    localStorage.setItem('configDatos', JSON.stringify(infoConfig))
    config = JSON.parse(localStorage.getItem('configDatos')!)
  }
  if (config.length !== infoConfig.length) {
    localStorage.setItem('configDatos', JSON.stringify(infoConfig))
    config = JSON.parse(localStorage.getItem('configDatos')!)
  }
  return config.length === infoConfig.length ? config : infoConfig
}
