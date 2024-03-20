import { MenssageGeneralContext } from '@renderer/utils/MessageGeneralContext'
import { useState } from 'react'
import useHookShared from './useHookShared'

const useApp = () => {
  const { eviarProcesoPines } = useHookShared()
  const [mensajeGeneral, setmensajeGeneral] = useState({ view: false, data: '' })
  const [selectScreen, setSelectScreen] = useState<TselectScreen>({ manual: false, config: false, auto:false })
  const [onOnchangeViewKeyBoardNumeric, setOnOnchangeViewKeyBoardNumeric] = useState({
    view: false,
    data: ''
  })
  const [activarMenuWifi, setActivarMenuWifi] = useState(false)
  const [nombreWifiConectada, setNombreWifiConectada] = useState('--------')
  eviarProcesoPines([])
  const menuWifiConfig = ():void => {
    setActivarMenuWifi((pre)=>!pre)
  }
  return {
    setOnOnchangeViewKeyBoardNumeric,
    setNombreWifiConectada,
    setmensajeGeneral,
    setSelectScreen, 
    menuWifiConfig,  
    nombreWifiConectada, 
    activarMenuWifi, 
    selectScreen,
    onOnchangeViewKeyBoardNumeric,
    MenssageGeneralContext,
    mensajeGeneral
  }
}

export default useApp
