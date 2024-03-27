/* eslint-disable @typescript-eslint/no-unused-vars */

interface infoMenu {
  title: string
  view: boolean
  component: JSX.Element
}

interface objDataPort {
  path: string
  baudRate: number
}
interface Idatakey {
  value: number | string
}
interface IMenssageG {
  view: boolean
  data: string
}

type GlobalContentMessage = {
  mensajeGeneral: IMenssageG
  setmensajeGeneral: (c: IMenssageG) => void
}
type SelectBaudios = {
  baudio: number
}
type TioPeripheral = {
  nombre: string
  estado: number
}
type TselectScreen = {
  manual: boolean
  config: boolean
  auto: boolean
}
type TdataConfig = {
  title: string
  dato: number
  hora1: number
  minu2: number
  time: boolean
}
type TdataRenderAuto = {
  title: string
  dato: number
}

type Twifi = {
  bssid: string
  channel: number
  frequency: number
  mac: string
  mode: string
  quality: number
  security: string
  security_flags: string
  signal_level: number
  ssid: string
}
