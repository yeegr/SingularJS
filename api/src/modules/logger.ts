import LogModel, { ILog } from '../system/log/LogModel'

class Logger {
  constructor(obj: any) {
    let log: ILog = new LogModel(obj)

    log.save().then().catch((err: Error) => {
      console.log(err)
    })
  }
}

export default Logger
