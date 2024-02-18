import { useState } from 'react';

export function ClockTime(): JSX.Element {
  let time  = new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/Bogota' })

  const [ctime,setTime] = useState(time)
  const UpdateTime=()=>{
    time =  new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/Bogota' })
    setTime(time)
  }
  setInterval(UpdateTime)
  return <strong className='clock-time'>{ctime}</strong>
}
