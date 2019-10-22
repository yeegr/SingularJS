import { NativeError, Schema, model } from 'mongoose'

import { CONST } from '@common'
import * as ModelHelper from '@modelHelpers'

import IAction from '../IAction'

let FollowSchema: Schema = new Schema({
  // creator
  creator: {
    type: Schema.Types.ObjectId,
    refPath: 'creatorRef',
    required: true
  },
  // user type
  creatorRef: {
    type: String,
    required: true,
    enum: CONST.USER_TYPES_ENUM,
    default: CONST.USER_TYPES.CONSUMER
  },
  // reference id
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
  }
}, {
  toObject: {
    virtuals: false
  },
  toJSON: {
    virtuals: false
  }
})

FollowSchema.index({ 
  creator: 1,
  creatorRef: 1,
  target: 1,
  targetRef: 1
}, {
  unique: true
})

FollowSchema.virtual('CreatorModel', {
  ref: (doc: IAction) => doc.creatorRef,
  localField: 'creator',
  foreignField: '_id',
  justOne: true
})

FollowSchema.virtual('TargetModel', {
  ref: (doc: IAction) => doc.targetRef,
  localField: 'target',
  foreignField: '_id',
  justOne: true
})

FollowSchema.post('save', function(action: IAction) {
  let TargetModel = ModelHelper.getModelFromName(action.targetRef)

  TargetModel
  .findByIdAndUpdate(action.target, {$inc: {followCount: 1}})
  .then()
  .catch((err: NativeError) => {
    console.log(err)
  })
})

FollowSchema.post('findOneAndRemove', function(action: IAction) {
  if (action) {
    let TargetModel = ModelHelper.getModelFromName(action.targetRef)
    
    TargetModel
    .findByIdAndUpdate(action.target, {$inc: {followCount: -1}})
    .then()
    .catch((err: NativeError) => {
      console.log(err)
    })
  }
})

export default model<IAction>('Follow', FollowSchema)
