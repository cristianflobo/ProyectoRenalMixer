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
  eviarProcesoPines([])
  return {
    setOnOnchangeViewKeyBoardNumeric,
    setmensajeGeneral,
    setSelectScreen,
    selectScreen,
    onOnchangeViewKeyBoardNumeric,
    MenssageGeneralContext,
    mensajeGeneral
  }
}

export default useApp
