import {NativeError, Schema, model} from 'mongoose'

import {CONST, UTIL }  from '@common'
import * as ModelHelper from '@modelHelpers'

import Activity, { IActivity} from '../activity/ActivityModel'
import IProcess from './IProcess'

let ProcessSchema: Schema = new Schema({
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
    enum: CONST.USER_TYPES_ENUM
  },
  // target
  target: {
    type: Schema.Types.ObjectId,
    refPath: 'targetRef',
    required: true
  },
  // target type
  targetRef: {
    type: String,
    required: true,
    enum: CONST.ACTION_TARGETS_ENUM
  },
  // process type
  type: {
    type: String,
    required: true,
    enum: CONST.PROCESS_TYPES_ENUM
  },
  // activities
  activities: [{
    type: Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  }],
  // current process status
  status: {
    type: String,
    required: true,
    default: CONST.STATUSES.PROCESS.PENDING
  },
  // process expiration time
  expireAt: {
    type: Number
  },
  // process completed time
  completedAt: {
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

ProcessSchema.virtual('CreatorModel', {
  ref: (doc: IProcess) => doc.creatorRef,
  localField: 'creator',
  foreignField: '_id',
  justOne: true
})

ProcessSchema.virtual('TargetModel', {
  ref: (doc: IProcess) => doc.targetRef,
  localField: 'target',
  foreignField: '_id',
  justOne: true
})

/**
 * Mark the process as 'FINALIZED'
 *
 * @class ProcessSchema
 * @method finalize
 * @returns {void}
 */
ProcessSchema.methods.finalize = function(status: string): Promise<IProcess> {
  let TargetModel = ModelHelper.getModelFromName(this.targetRef)

  return TargetModel
  .findByIdAndUpdate(this.target, {status})
  .then((data: any) => {
    this.status = CONST.STATUSES.PROCESS.FINALIZED
    this.completedAt = UTIL.getTimestamp()
    return this.save()
  })
  .then((data: IProcess) => {
    return this.returnData(data)
  })
}

/**
 * Mark the process as 'FINALIZED'
 *
 * @class ProcessSchema
 * @method finalize
 * @returns {IProcess}
 */
ProcessSchema.methods.addActivity = function(act: IActivity): Promise<IProcess> {
  let activity = new Activity(act)

  return activity
  .save()
  .then((data: IActivity) => {
    this.activities.push(data._id)
    return this.save()
  })
  .then((data: IProcess) => {
    return this.returnData(data)
  })
}

ProcessSchema.pre('save', function(next: Function) {
  (this as IProcess).wasNew = (this as IProcess).isNew
  next()
})

/**
 * Return formatted process
 *
 * @class ProcessSchema
 * @method returnData
 * @returns {IProcess}
 */
ProcessSchema.methods.returnData = function(process: IProcess): Promise<IProcess> {
  return process
  .populate({
    path: 'creator', 
    select: CONST.BASIC_USER_INFO,
    options: {
      lean: true
    }
  })
  .populate('target', CONST.BASIC_CONTENT_INFO)
  .populate({
    path: 'activities',
    populate: [{
      path: 'creator',
      select: CONST.BASIC_USER_INFO,
      options: {
        lean: true
      }
    }, {
      path: 'target',
      select: CONST.BASIC_CONTENT_INFO,
      options: {
        lean: true
      }
    }, {
      path: 'handler',
      select: CONST.BASIC_USER_INFO,
      options: {
        lean: true
      }
    }]
  })
  .execPopulate()
}

export { IProcess }

export default model<IProcess>('Process', ProcessSchema)
