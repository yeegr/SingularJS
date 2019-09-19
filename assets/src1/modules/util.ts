export function readEnv(input: any): any {
  let arr: string[] = input.toString().split('\n'),
    obj: any = {}

  arr.forEach((kvp: string) => {
    if (kvp.length > 0) {
      let tmp: string[] = kvp.split('='),
      key: string = tmp[0],
      value: string = tmp[1]

      value = (value.charAt(0) === '"') ? value.substring(1) : value
      value = (value.charAt(value.length - 1) === '"') ? value.substring(0, value.length - 1) : value

      if (key.length > 0) {
        obj[key] = value
      }
    }
  })

  return obj
}