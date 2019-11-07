import {NativeError, Schema, model} from 'mongoose'

import {CONST} from '@common'
import * as ModelHelper from '@modelHelpers'

import IAction from '../IAction'

let DownloadSchema: Schema = new Schema({
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
    refPath: 'targerRef',
    required: true
  },
  // target model type
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

DownloadSchema.virtual('CreatorModel', {
  ref: (doc: IAction) => doc.creatorRef,
  localField: 'creator',
  foreignField: '_id',
  justOne: true
})

DownloadSchema.virtual('TargetModel', {
  ref: (doc: IAction) => doc.targetRef,
  localField: 'target',
  foreignField: '_id',
  justOne: true
})

DownloadSchema.post('save', function(action: IAction) {
  let TargetModel = ModelHelper.getModelFromName(action.targetRef)

  TargetModel
  .findByIdAndUpdate(action.target, {$inc: {downloadCount: 1}})
  .then()
  .catch((err: NativeError) => {
    console.log(err)
  })
})

export default model<IAction>('Download', DownloadSchema)
