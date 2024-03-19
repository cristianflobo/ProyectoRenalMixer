import infoMenuBar from '@renderer/utils/infoMenuBar'
import { MouseEvent, useState } from 'react'

const useConfiguration = () => {
  const [listInfoMenu, setlistInfoMenu] = useState(infoMenuBar)
  const selectConfig = (event: MouseEvent<HTMLButtonElement>):void => {
    const valueBtn = (event.target as HTMLButtonElement).value
    const updateInfoMenu = infoMenuBar.map((item: infoMenu) => {
      item.title === valueBtn ? (item.view = true) : (item.view = false)
      return { ...item }
    })
    setlistInfoMenu(updateInfoMenu)
  }

  return {
    selectConfig,
    listInfoMenu
  }
}

export default useConfiguration
