import ILog from '../log/ILog'

export default interface IErr extends ILog {
  slug?: string
  status: number
  code?: string
  key?: string
  message?: string
}