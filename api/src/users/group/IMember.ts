import {Document, Schema} from 'mongoose'

import IUSer from '../IUser'

export default interface IMember extends Document {
  userId: Schema.Types.ObjectId
  userRef: string
  isCreator: boolean
  isManager: boolean
  alias: string
  joined: number

  // virtual fields
  user: IUSer
}
