import { useState } from 'react';

export function ClockTime(): JSX.Element {
  let time  = new Date().toLocaleTimeString()

  const [ctime,setTime] = useState(time)
  const UpdateTime=()=>{
    time =  new Date().toLocaleTimeString()
    setTime(time)
  }
  setInterval(UpdateTime)
  return <strong className='clock-time'>{ctime}</strong>
}
