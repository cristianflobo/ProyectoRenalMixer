import { MouseEvent, useState } from 'react'

const useKeyBoardNumeric = (setKey) => {
  const [onChangeK, setOnChangeK] = useState('')
  let dataKey = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
    { value: 6 },
    { value: 7 },
    { value: 8 },
    { value: 9 },
    { value: 0 },
    { value: 'Ok' },
    { value: '<<' }
  ]
  const onChangeKey = (event: MouseEvent<HTMLButtonElement>) => {
    let key = event.currentTarget.value
    if (parseInt(key) >= 0 && parseInt(key) <= 9) {
      setOnChangeK(onChangeK + key)
    }
    console.log(key)
    if (key === '<<' && key.length > 0) {
      setOnChangeK((item) => item.substring(0, item.length - 1))
    }
    if (key === 'Ok') {
      // if(onChangeK === "")setOnChangeK("0")
      // setKey({ data: parseInt(onChangeK === "" || onChangeK === 'Ok'?"0":onChangeK), view: false })
      
      if (parseInt(onChangeK) >= 0) {
        setKey({ data: parseInt(onChangeK), view: false, change:true })
        console.log("nooo---", onChangeK)
      }else {
        setKey({ data: 0, view: false })
      }
    }
  }
  return {
    onChangeKey,
    dataKey,
    onChangeK
  }
}

export default useKeyBoardNumeric
