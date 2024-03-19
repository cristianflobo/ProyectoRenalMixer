import { sola } from '@renderer/images/index'
import { ClockTime } from '../clockTime/Clock'
import '../../styles/navBar.css'

export function NavBa(): JSX.Element {
  return (
    <div className="navBar">
      <ClockTime />
      <div className='sola'>
        <img style={{ width: '200px', height: '100px' }} src={sola}></img>
      </div>
      <div className='rtc'>
        <strong>RTS S.A.S</strong>
      </div>
    </div>
  )
}
