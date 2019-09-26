import { Document } from 'mongoose'

import IPoint from '@content/_shared/point/IPoint'

export default interface IAgenda extends Document {
  day: number
  startTime: number
  endTime?: number
  duration?: number
  title?: string
  description?: string
  startPoint?: IPoint
  endPoint?: IPoint
}