import {Document} from 'mongoose'

import IPoint from '@content/_shared/point/IPoint'

export default interface IBatch extends Document {
  title?: string
  misc?: string
  startDate: number
  deadline?: number
  rallyPoint?: IPoint
  rallyTime?: number
  status?: string
}