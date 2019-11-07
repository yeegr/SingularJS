import {Document, Schema} from 'mongoose'
import IMember from './IMember'

export default interface IGroup extends Document {
  [key: string]: any
  _id: Schema.Types.ObjectId

  title: string
  slug: string
  avatar?: string
  background?: string
  members: [IMember]
  updated: number
  status: string
  settings: {
    membership: string
  }
}