import {Schema, model} from 'mongoose'

import {CONST} from '@common'

import IErr from './IErr'

let ErrSchema: Schema = new Schema({
  // user id
  creator: {
    type: Schema.Types.ObjectId,
    default: null
  },
  // user type
  creatorRef: {
    type: String,
    enum: CONST.USER_TYPES_ENUM
  },
  // target id
  target: {
    type: Schema.Types.ObjectId
  },
  // target reference
  targetRef: {
    type: String,
    enum: CONST.ACTION_TARGETS_ENUM
  },
  // target slug
  slug: {
    type: String
  },
  // user action
  action: {
    type: String,
    required: true
  },
  // internal error code
  status: {
    type: Number,
    default: 500
  },
  // internal error code
  code: {
    type: Number,
    default: 11000
  },
  // model key
  key: {
    type: String,
    default: ''
  },
  // error message
  message: {
    type: String,
    default: ''
  },
  // user request ua info
  ua: {
    type: Object
  }
})

export { IErr }

export default model<IErr>('Err', ErrSchema)
