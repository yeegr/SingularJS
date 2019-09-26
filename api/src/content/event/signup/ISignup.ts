import { Document, Schema } from 'mongoose'

import IAttendee from '../attendee/IAttendee'

export default interface ISignup extends Document {
  _id: Schema.Types.ObjectId
  creator: Schema.Types.ObjectId
  event: Schema.Types.ObjectId
  batch: number
  attendees: IAttendee[]
  total: number
  status: string
  paymentMethod: string
}