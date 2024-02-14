import React, { useEffect, useState } from 'react'
let ioPeripheral = [
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
  const [selectIo, setSelectIo] = useState<TioPeripheral[]>()
 

  useEffect(() => {
    setSelectIo(setIoOff())
    return () => {}
  }, [])

  const changeIo = (event: React.MouseEvent<HTMLButtonElement>) => {
    let ioSelect = event.currentTarget.value
    let pru = selectIo?.map((item: TioPeripheral)=>{
        if(ioSelect === item.nombre) item.estado === 0 ? (item.estado = 1) : (item.estado = 0)
        return item
    })
    setSelectIo(pru)
  }
  const setIoOff = () => {
    ioPeripheral.forEach((element:TioPeripheral) => {
        element.estado = 0
    });
    return ioPeripheral
  }
  return { changeIo, selectIo }
}

export default useManual
