import {Schema, model} from 'mongoose'

import {CONST, UTIL} from '@common'

import IMember from './IMember'

let MemberSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    refPath: 'userRef',
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
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

MemberSchema.virtual('user', {
  ref: (doc: IMember) => doc.userRef,
  localField: 'userId',
  foreignField: '_id',
  justOne: true
})

export { IMember }

export default MemberSchema
