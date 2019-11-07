import {Document, Schema} from 'mongoose'
import IMedia from '@content/_shared/media/IMedia'
import IUri from '@content/_shared/uri/IUri'

export default interface IMessage extends Document {
  user: Schema.Types.ObjectId
  ref: string
  sendAt: number
  format: string
  txt?: string
  media?: IMedia
  url?: IUri
}