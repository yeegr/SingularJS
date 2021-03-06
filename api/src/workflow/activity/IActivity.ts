import {Document, Schema} from 'mongoose'

export default interface IActivity extends Document {
  _id: Schema.Types.ObjectId
  creator: Schema.Types.ObjectId
  creatorRef: string
  target: Schema.Types.ObjectId
  targetRef: string
  action: string
  initStatus: string
  expireAt?: number
  notes?: string
  state: string
  handler?: Schema.Types.ObjectId
  handlerRef?: string
  processedAt?: number
  assignedStatus?: string
  comment?: string

  // document status
  wasNew: boolean

  // virtual fields
  CreatorModel: any
  TargetModel: any
  HandlerModel?: any
}