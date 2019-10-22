import { Schema } from 'mongoose'
import IAction from '@actions/IAction'

export default interface IInvitation extends IAction {
  recipient: Schema.Types.ObjectId
  recipientRef: string
  state: string
  message?: string
  expireAt: number
  respondAt?: number
}