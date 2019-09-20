import { Schema } from 'mongoose'

export default interface ITodoReport extends Document {
  [key: string]: any
  _id: Schema.Types.ObjectId

  // referenced checklist
  todo: Schema.Types.ObjectId

  // for which date this report is generated
  date: number

  // creator
  creator: Schema.Types.ObjectId
  creatorRef: string

  // check if the list was past due time
  past_due: boolean

  // checkmark each heading
  items: boolean[]

  // supervisor report
  note?: string
  updated: number
}
