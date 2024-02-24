const useHookShared = () => {
  const datosGpio = [
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
    },
    {
      nombre: 'buzzer',
      estado: 0
    }
  ]
  const eviarProcesoPines = (procesoIO: string[]) => {
    let envioGpioFinal = datosGpio.map((item: TioPeripheral) => {
      let buscar = procesoIO.find((item2) => item2 === item.nombre)
      if (buscar === undefined) {
        item.estado = 0
      } else {
        item.estado = 1
      }
      return item
    })
    console.log(envioGpioFinal)
    window.electron.ipcRenderer.send('procesoPinesSalida', envioGpioFinal)
  }
  return { eviarProcesoPines }
}

export default useHookShared
