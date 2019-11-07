import {Schema, model} from 'mongoose'

import {CONST, UTIL} from '@common'
import * as ModelHelper from '@modelHelpers'

import IReminderList from './IReminderList'

let ReminderListSchema: Schema = new Schema({
  // issuer
  creator: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // issuer type
  creatorRef: {
    type: String,
    required: true,
    enum: CONST.USER_TYPES_ENUM,
    default: CONST.USER_TYPES.CONSUMER
  },
  // user
  user: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // user type
  userRef: {
    type: String,
    required: true,
    enum: CONST.USER_TYPES_ENUM,
    default: CONST.USER_TYPES.CONSUMER
  },
  // title
  title: {
    type: String,
    default: '',
    required: true
  },
  // description
  description: {
    type: String,
    default: ''
  },
  // list of tasks
  tasks: {
    type: [String],
    required: true,
    default: ['']
  },
  // due time
  // stored in the format of minutes from hour zero
  due_time: {
    type: Number,
    required: true
  },
  // alarms
  // stored in the format of minutes from hour zero
  alarms: {
    type: [Number],
    required: true
  },
  // recurrence
  // stored in strings
  recurrence: {
    type: String,
    required: true,
    enum: CONST.RECURRENCE_ENUM,
    default: CONST.CONTENT_SETTINGS.RECURRENCE.WORKDAYS
  },
  // [0,1,2,3,4,5,6]
  days_of_week: {
    type: [Number]
  },
  // 1-5
  week_of_month: {
    type: Number
  },
  // 1-31
  date_of_month: {
    type: Number
  },
  // 0-11
  month_of_year: {
    type: Number
  },
  // status
  status: {
    type: String,
    required: true,
    enum: CONST.TODOLIST_STATUSES_ENUM,
    default: CONST.STATUSES.CONTENT.EDITING
  },
  // last updated time
  updated: {
    type: Number,
    required: true,
    default: () => UTIL.getTimestamp()
  }
}, {
  toObject: {
    virtuals: false
  },
  toJSON: {
    virtuals: false
  }
})

ReminderListSchema.pre('findOneAndUpdate', function(next: Function): void {
  // Set last modified time when values of only following props are changed
  ModelHelper.setUpdateTime((this as any), ['title', 'description', 'tasks', 'due_time', 'recurrence', 'days_of_week', 'week_of_month', 'date_of_month', 'month_of_year'])
  next()
})

export { IReminderList }

export default model<IReminderList>('ReminderList', ReminderListSchema)