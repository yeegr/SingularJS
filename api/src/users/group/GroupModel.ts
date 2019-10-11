import { Schema, model } from 'mongoose'

import { CONST, UTIL } from '@common'

import IGroup, { IMember } from './IGroup'

let GroupSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  updated: {
    type: Number,
    required: true,
    default: UTIL.getTimestamp()
  },
  members: [{
    user: {
      type: Schema.Types.ObjectId,
      required: true
    },
    userRef: {
      type: String,
      required: true,
      enum: CONST.USER_TYPES_ENUM,
      default: CONST.USER_TYPES.CONSUMER
    },
    isCreator: {
      type: Boolean,
      required: true,
      default: false
    },
    isManager: {
      type: Boolean,
      required: true,
      default: false
    },
    alias: {
      type: String,
      required: true
    },
    joined: {
      type: Number,
      required: true,
      default: UTIL.getTimestamp()
    },
    status: {
      type: String,
      required: true,
      default: 'active'
    }
  }]
}, {
  toObject: {
    virtuals: false
  },
  toJSON: {
    virtuals: false
  }
})

export { IGroup }

export default model<IGroup>('Group', GroupSchema)