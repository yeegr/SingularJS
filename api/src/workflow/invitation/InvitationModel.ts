import {NativeError, Schema, model} from 'mongoose'

import {CONST} from '@common'
import * as ModelHelper from '@modelHelpers'

import IInvitation from './IInvitation'

let InvitationSchema: Schema = new Schema({
  // creator
  creator: {
    type: Schema.Types.ObjectId,
    refPath: 'creatorRef',
    required: true
  },
  // creactor user type
  creatorRef: {
    type: String,
    required: true,
    enum: CONST.USER_TYPES_ENUM,
    default: CONST.USER_TYPES.CONSUMER
  },
  // target id
  target: {
    type: Schema.Types.ObjectId,
    refPath: 'targetRef',
    required: true
  },
  // target reference
  targetRef: {
    type: String,
    required: true,
    enum: CONST.ACTION_TARGETS_ENUM
  },
  // recipient
  recipient: {
    type: Schema.Types.ObjectId,
    refPath: 'recipientRef',
    required: true
  },
  // recipient user type
  recipientRef: {
    type: String,
    required: true,
    enum: CONST.USER_TYPES_ENUM,
    default: CONST.USER_TYPES.CONSUMER
  },
  // invitation state
  state: {
    type: String,
    required: true,
    enum: CONST.INVITATION_STATES_ENUM,
    default: CONST.INVITATION_STATES.PENDING
  },
  // invitation message
  message: {
    type: String,
    default: ''
  },
  // expiration time
  expireAt: {
    type: Number
  },
  // response time
  respondAt: {
    type: Number
  }
}, {
  toObject: {
    virtuals: false
  },
  toJSON: {
    virtuals: false
  }
})

InvitationSchema.index({ 
  creator: 1,
  creatorRef: 1,
  target: 1,
  targetRef: 1,
  recipient: 1,
  recipientRef: 1
}, {
  unique: true
})

InvitationSchema.virtual('CreatorModel', {
  ref: (doc: IInvitation) => doc.creatorRef,
  localField: 'creator',
  foreignField: '_id',
  justOne: true
})

InvitationSchema.virtual('TargetModel', {
  ref: (doc: IInvitation) => doc.targetRef,
  localField: 'target',
  foreignField: '_id',
  justOne: true
})

InvitationSchema.virtual('RecipientModel', {
  ref: (doc: IInvitation) => doc.recipientRef,
  localField: 'recipient',
  foreignField: '_id',
  justOne: true
})

/**
 * TODO: send notification after new invitation is saved
 */
InvitationSchema.post('save', function(action: IInvitation) {
})

InvitationSchema.post('findOneAndUpdate', function(action: IInvitation) {
})

export default model<IInvitation>('Invitation', InvitationSchema)
