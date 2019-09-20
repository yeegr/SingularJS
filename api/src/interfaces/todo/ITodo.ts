import { Schema } from 'mongoose'

export default interface ITodo extends Document {
  [key: string]: any
  _id: Schema.Types.ObjectId

  // creator
  creator: Schema.Types.ObjectId
  creatorRef: string

  // user
  user: Schema.Types.ObjectId
  userRef: string

  title: string
  description?: string
  headings: string[]
  due_time: number
  alarm: number

  recurrence: string
  days_of_week?: number[]
  week_of_month?: number
  day_of_month?: number
  month_of_year?: number

  status: string
  updated: number
}
