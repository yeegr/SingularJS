import { Schema } from 'mongoose'
import IContent from '../IContent'

import IAgenda from './agenda/IAgenda'
import ISubset from './subset/ISubset'
import IMedia from '../_shared/media/IMedia'

export default interface IEvent extends IContent {
  isPublic: boolean
  requireApproval: boolean
  misc?: [{
    key: string
    value: string
  }]
  destination?: string
  gallery: IMedia[]
  notes: string[]
  gears: Schema.Types.Mixed[]
  city?: string
  country?: string
  maxAttendee: number
  minAttendee: number
  expenses: {
    deposit?: number
    perHead?: number
    insurance?: number
    detail?: string[]
    includes?: string[]
    excludes?: string[]
  }
  contacts: [{
    handle: string
    mobile?: string
    email?: string
  }]
  schedule: IAgenda[]
  subsets: ISubset[]
}