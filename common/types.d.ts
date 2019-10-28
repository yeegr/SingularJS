// adds type for JSON
declare module '*.json' {
  const value: any
  export default value
}

// adds type for ENV
declare module '*.env' {
  const content: string
  export default content
}
