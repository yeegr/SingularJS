// adds type for JSON
declare module NodeJS {
  interface Global {
    storageEngine: any
    storageType: string
    apiUrl: string
    assetUrl: string
    device: any
  }
}
