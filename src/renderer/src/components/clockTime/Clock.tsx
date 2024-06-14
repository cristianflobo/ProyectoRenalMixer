import { useEffect, useRef } from 'react';

export function ClockTime(): JSX.Element {
  const h1 = useRef<HTMLInputElement>(null);
  const ti = () => {
    return new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/Bogota' })
  };
  useEffect(() => {
    const cl = setInterval(() => {
      if(h1.current){
      h1.current.innerHTML = `${ti()}`;
      }
    }, 1000);
    return () => clearInterval(cl);
  }, []);

  return <strong ref={h1} className='clock-time'>{ti()}</strong>
}
