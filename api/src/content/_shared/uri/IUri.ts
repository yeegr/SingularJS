import { Document } from 'mongoose'

export default interface IUri extends Document {
  url: string
  title: string
  thumb?: string
  excerpt?: string
}