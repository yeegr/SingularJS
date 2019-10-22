import { Schema, model } from 'mongoose'

import { CONST, CONFIG } from '@common'

import Attendee from '../attendee/AttendeeModel'

import ISignup from './ISignup'

let SignupSchema: Schema = new Schema({
  // member
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'Consumer',
    required: true  
  },
  // event id
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  // batch/subset index number
  batch: {
    type: Number,
    required: true,
    default: 0
  },
  // attendees | participants
  attendees: [Attendee],
  // total price
  total: {
    type: Number,
    required: true,
    default: 0
  },
  // order status
  status: {
    type: String,
    required: true,
    enum: CONST.PAYMENT_STATUSES_ENUM,
    default: CONST.STATUSES.PAYMENT.PENDING
  },
  // payment methods
  paymentMethod: {
    type: String,
    required: true,
    enum: CONST.PAYMENT_METHODS_ENUM,
    default: CONFIG.DEFAULT_PAYMENT_METHOD
  }
})

export default model<ISignup>('Signup', SignupSchema)
