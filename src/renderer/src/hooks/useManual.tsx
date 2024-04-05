import React, { useEffect, useState } from 'react'
import useHookShared from './useHookShared'
const ioPeripheral = [
  {
    nombre: 'valvula 1',
    estado: 0
  },
  {
    nombre: 'valvula 2',
    estado: 0
  },
  {
    nombre: 'valvula 3',
    estado: 0
  },
  {
    nombre: 'valvula 4',
    estado: 0
  },
  {
    nombre: 'valvula 5',
    estado: 0
  },
  {
    nombre: 'valvula 6',
    estado: 0
  },
  {
    nombre: 'bomba 1',
    estado: 0
  },
  {
    nombre: 'bomba 2',
    estado: 0
  },
  {
    nombre: 'bomba 3',
    estado: 0
  }
]

const useManual = () => {
  const { eviarProcesoPinesConBombaDistribuicion } = useHookShared()
  const [selectIo, setSelectIo] = useState<TioPeripheral[]>()

  useEffect(() => {
    window.electron.ipcRenderer.send('leerPinesSalidaMain')
    window.electron.ipcRenderer.on('leerPinesSalidaRender', (_event, data) => {
      setSelectIo(data)
    })
    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('leerPinesSalidaRender')
    }
  }, [])

  const changeIo = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const ioSelect = event.currentTarget.value
    const change = selectIo?.map((item: TioPeripheral) => {
      if (ioSelect === item.nombre) item.estado === 0 ? (item.estado = 1) : (item.estado = 0)
      return item
    })
    if (change !== undefined) {
      const auxArray: string[] = []
      change.forEach((item) => {
        if (item.estado === 1) auxArray.push(item.nombre)
      })
      eviarProcesoPinesConBombaDistribuicion(auxArray)
      setSelectIo(change)
    }
  }
  return { changeIo, selectIo }
}

export default useManual
