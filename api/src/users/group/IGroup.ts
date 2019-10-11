import { Document, Schema } from 'mongoose'

export interface IMember {
  user: Schema.Types.ObjectId
  userRef: string
  isCreator: boolean
  isManager: boolean
  alias: string
  joined: number
  status: string
}

export default interface IGroup extends Document {
  [key: string]: any
  _id: Schema.Types.ObjectId

  title: string
  members: [IMember]
  updated: number
}