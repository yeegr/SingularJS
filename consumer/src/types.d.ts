// adds type for Global
declare module NodeJS {
  interface Global {
    storageEngine: any
    storageType: string
    apiUrl: string
    assetUrl: string
    device: any
  }
}
