import {NativeError, Schema, model} from 'mongoose'

import {CONST} from '@common'
import * as ModelHelper from '@modelHelpers'

import IComment from './IComment'
import IContent from '@content/IContent'

let CommentSchema: Schema = new Schema({
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
  // parent comment
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  // comment rating
  rating: {
    type: Number,
    required: false
  },
  // store diff between original and updated ratings
  diff: {
    type: Number,
    default: 0
  },
  // comment content
  content: {
    type: String,
    default: ''
  }
}, {
  toObject: {
    virtuals: false
  },
  toJSON: {
    virtuals: false
  }
})

CommentSchema.virtual('CreatorModel', {
  ref: (doc: IComment) => doc.creatorRef,
  localField: 'creator',
  foreignField: '_id',
  justOne: true
})

CommentSchema.virtual('TargetModel', {
  ref: (doc: IComment) => doc.targetRef,
  localField: 'target',
  foreignField: '_id',
  justOne: true
})


CommentSchema.pre('save', function(next: Function) {
  (this as IComment).wasNew = this.isNew
  next()
})

CommentSchema.post('save', function(comment: IComment) {
  let CreatorModel = ModelHelper.getModelFromName(comment.creatorRef),
    TargetModel = ModelHelper.getModelFromName(comment.targetRef),
    wasNew = this.wasNew

  TargetModel
  .findById(comment.target)
  .then((doc: any) => {
    if ((doc as IContent).commentSetting === CONST.CONTENT_SETTINGS.COMMENT.OPEN) {
      if (wasNew) {
        ModelHelper.addComment(doc, comment.rating)      

        CreatorModel
        .findByIdAndUpdate(comment.creator, {$inc: {commentCount: 1}})
        .then()
        .catch((err: NativeError) => {
          console.log(err)
        })
      } else {
        ModelHelper.updateComment(doc, comment.diff)
      }
    }
  })
  .catch((err: NativeError) => {
    console.log(err)
  })
})

CommentSchema.post('findOneAndRemove', function(comment: IComment) {
  let CreatorModel = ModelHelper.getModelFromName(comment.creatorRef),
    TargetModel = ModelHelper.getModelFromName(comment.targetRef)
  
  TargetModel
  .findById(comment.target)
  .then((doc: any) => {
    ModelHelper.removeComment(doc, comment.rating)

    CreatorModel
    .findOneAndUpdate({
      _id: comment.creator,
      commentCount: {$gt: 0}
    }, {$inc: {commentCount: -1}})
    .then()
    .catch((err: NativeError) => {
      console.log(err)
    })  
  })
  .catch((err: NativeError) => {
    console.log(err)
  })
})

export { IComment }

export default model<IComment>('Comment', CommentSchema)
