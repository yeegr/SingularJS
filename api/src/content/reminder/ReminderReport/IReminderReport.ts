import {Document, Schema} from 'mongoose'

export default interface IReminderReport extends Document {
  [key: string]: any
  _id: Schema.Types.ObjectId

  // referenced checklist
  list: Schema.Types.ObjectId

  // for which date this report is generated
  date: number

  // check if the list was past due time
  status: boolean

  // checkmark each heading
  tasks: boolean[]

  // supervisor report
  note?: string
  updated: number
}
