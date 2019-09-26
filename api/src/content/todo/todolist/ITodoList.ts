import { Document, Schema } from 'mongoose'

export default interface ITodoList extends Document {
  [key: string]: any
  _id: Schema.Types.ObjectId

  // creator of the to-do list
  creator: Schema.Types.ObjectId
  creatorRef: string

  // user assigned to complete the to-do list
  user: Schema.Types.ObjectId
  userRef: string

  // content of the to-do list
  title: string
  description?: string
  tasks: string[]
  due_time: number
  alarm: number

  // recurrence
  recurrence: string
  days_of_week?: number[]
  week_of_month?: number
  day_of_month?: number
  month_of_year?: number

  status: string
  updated: number
}
