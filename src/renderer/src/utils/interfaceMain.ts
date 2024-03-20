export interface serialPortList {
  friendlyName: string
  manufacturer: string
  path: string
  pnpId: string
  locationId: any,
  productId: any,
  serialNumber: any,
  vendorId: any,
}

export type Twifi = {
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