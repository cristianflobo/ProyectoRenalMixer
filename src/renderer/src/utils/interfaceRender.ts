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

interface PropsProcesoAuto {
  datos: TdataRenderAuto[];
  returnHome: () => void;
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
  auto:boolean
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