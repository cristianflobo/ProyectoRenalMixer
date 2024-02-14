import { MenssageGeneralContext } from '@renderer/utils/MessageGeneralContext'
import { useContext, useEffect, useState } from 'react'

const useEscaner = () => {
  const messageContext = useContext(MenssageGeneralContext) as GlobalContentMessage
  const [serialPortArray, setSerialPortArray] = useState<[]>()
  const [baudiosSelect, setBaudiosSelect] = useState(300)
  useEffect(() => {
    window.electron.ipcRenderer.send('verificarConexionMain')

    window.electron.ipcRenderer.on('puertosEncontrados', (_event, puertos) => {
      setPuertos(puertos)
      console.log(puertos)
    })
    window.electron.ipcRenderer.on('verificarConexionWeb', (_event, data) => {
      setSerialPortArray(data)
    })
    window.electron.ipcRenderer.on('menssageFromMain', (_event, data) => {
      messageContext.setmensajeGeneral({ view: true, data })
    })
    window.electron.ipcRenderer.on('dataSerial1', (_event, data) => {
      console.log('dataSerial1', data)
    })
    window.electron.ipcRenderer.on('dataSerial2', (_event, data) => {
      console.log('dataSerial2', data)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners('puertosEncontrados')
      window.electron.ipcRenderer.removeAllListeners('verificarConexionWeb')
      window.electron.ipcRenderer.removeAllListeners('menssageFromMain')
    }
  }, [])

  let selectBaudios = [
    {
      baudio: 300
    },
    {
      baudio: 1200
    },
    {
      baudio: 2400
    },
    {
      baudio: 4800
    },
    {
      baudio: 9600  
    },
    {
      baudio: 19200 
    },
    {
      baudio: 38400 
    },
    {
      baudio: 57600 
    },
    {
      baudio: 74880 
    },
    {
      baudio: 115200 
    },
    {
      baudio: 230400 
    },
    {
      baudio: 250000 
    },

  ]

  const [puertos, setPuertos] = useState([])
  const escanear = async () => {
    window.electron.ipcRenderer.send('buscarPuertos')
  }

  const desconectar = (event: React.MouseEvent<HTMLButtonElement>) => {
    window.electron.ipcRenderer.send('desconectarSerial', event.currentTarget.value)
    window.electron.ipcRenderer.send('verificarConexionMain')
    escanear()
  }

  const conexionPueroSerial = (event: React.MouseEvent<HTMLButtonElement>) => {
    window.electron.ipcRenderer.send('conectarSerial', {path:event.currentTarget.value, baud:baudiosSelect})
    setTimeout(() => {
      window.electron.ipcRenderer.send('verificarConexionMain')
    }, 200)

    escanear()
  }
  const onChangeSelect = (event:React.ChangeEvent<HTMLSelectElement>) => {
    setBaudiosSelect(parseInt(event.target.value))
  }

  return {
    conexionPueroSerial,
    onChangeSelect,
    desconectar,
    escanear,
    serialPortArray,
    selectBaudios,
    puertos
  }
}

export default useEscaner
