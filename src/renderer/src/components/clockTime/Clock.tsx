import { useState } from 'react';
import { prcInterval } from 'precision-timeout-interval';

export function ClockTime(): JSX.Element {
  let time  = new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/Bogota' })
  const [ctime,setTime] = useState(time)
  const UpdateTime=():void => {
    time =  new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/Bogota' })
    setTime(time)
  }
  prcInterval(1000, () => UpdateTime())
  return <strong className='clock-time'>{ctime}</strong>
}
