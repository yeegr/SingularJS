import {Schema, model} from 'mongoose'
import randomstring from 'randomstring'

import {CONFIG, CONST, UTIL} from '@common'

import IGroup from './IGroup'
import MemberSchema from './MemberModel'

let GroupSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    default: randomstring.generate({
      length: CONFIG.GROUP_NAME_LENGTH,
      charset: CONFIG.GROUP_NAME_CHARSET
    })
  },
  updated: {
    type: Number,
    required: true,
    default: UTIL.getTimestamp()
  },
  status: {
    type: String,
    required: true,
    enum: CONST.GROUP_STATUSES_ENUM,
    default: CONST.STATUSES.GROUP.ACTIVE
  },
  settings: {
    membership: {
      type: String,
      required: true,
      enum: CONST.GROUP_SETTINGS_MEMBERSHIP_ENUM,
      default: CONST.GROUP_SETTINGS.MEMBERSHIP.OPEN
    }
  },
  members: [MemberSchema]
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

export { IGroup }

export default model<IGroup>('Group', GroupSchema)
