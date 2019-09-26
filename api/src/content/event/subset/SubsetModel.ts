import { Schema, model } from 'mongoose'
import * as validator from 'validator'

import { CONST } from '@common'

import Attendee from '../attendee/AttendeeModel'
import Point from '@content/_shared/point/PointModel'

import ISubset from './ISubset'

let SubsetSchema: Schema = new Schema({
  // title
  title: {
    type: String
  },
  // additional information
  misc: {
    type: String
  },
  // start date
  startDate: {
    type: Number,
    required: true
  },
  // deadline for signup
  deadline: {
    type: Number
  },
  // rally location
  rallyPoint: {
    type: Point
  },
  // rally time in minutes
  rallyTime: {
    type: Number,
    min: 0,
    max: 1439
  },
  // status
  status: {
    type: String,
    enum: CONST.EVENT_SUBSET_STATUSES_ENUM,
    default: CONST.STATUSES.EVENT_SUBSET.ACCEPTING
  },
  // attendees | participants
  attendees: [Attendee]
}, {
  _id: false
})

export default SubsetSchema
