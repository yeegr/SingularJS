import { Document, Schema } from 'mongoose'

export default interface IConsumer extends Document {
  [key: string]: any
  _id: Schema.Types.ObjectId
  ref: string
  username: string
  password: string
  handle: string
  name: string
  gender?: number
  pid?: string
  mobile: string
  email: string
  avatar: string
  background?: string
  locale?: string
  city?: string
  country?: string
  updated: number
  roles: string[]
  status: string
  verified?: Schema.Types.ObjectId
  expires: number

  // linked user accounts of the same user type
  // value of 'ref' are the same
  linked?: Schema.Types.ObjectId[]
  // name displayed within the linked accounts
  linkname?: string
  
  // virtual fields
  comments: Schema.Types.ObjectId[]

  // document status
  wasNew: boolean

  // methods
  comparePassword: Function
}