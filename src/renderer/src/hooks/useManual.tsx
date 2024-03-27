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
  const { eviarProcesoPines } = useHookShared()
  const [selectIo, setSelectIo] = useState<TioPeripheral[]>()

  useEffect(() => {
    const aux = setIoOff()
    setSelectIo(aux)
    eviarProcesoPines([])
    return (): void => {
      eviarProcesoPines([])
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
      eviarProcesoPines(auxArray)
      setSelectIo(change)
    }
  }
  const setIoOff = (): TioPeripheral[] => {
    ioPeripheral.forEach((element: TioPeripheral) => {
      element.estado = 0
    })
    return ioPeripheral
  }
  return { changeIo, selectIo }
}

export default useManual
