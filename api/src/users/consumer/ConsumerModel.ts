import {Schema, model} from 'mongoose'
import bcrypt from 'bcryptjs'
import validator from 'validator'

import {CONFIG, CONST, UTIL} from '@common'
import * as ModelHelper from '@modelHelpers'

import IConsumer from './IConsumer'

/**
 * @class Consumer
 * @mixes { ConsumerSchema.methods }
 */
let ConsumerSchema: Schema = new Schema({
  // user type
  ref: {
    type: String,
    required: true,
    default: CONST.USER_TYPES.CONSUMER,
    enum: [CONST.USER_TYPES.CONSUMER]
  },
  // user name
  username: {
    type: String,
    required: true,
    default: () => CONST.CONSUMER_HANDLE_PREFIX + UTIL.getTimestamp(),
    unique: true,
    minlength: CONST.INPUT_LIMITS.MIN_HANDLE_LENGTH,
    maxlength: CONST.INPUT_LIMITS.MAX_HANDLE_LENGTH,
    trim: true,
    index: true
  },
  // user password, may or may not required
  password: {
    type: String,
    default: '',
    trim: true
  },
  // user handle
  handle: {
    type: String,
    required: true,
    default: () => CONST.CONSUMER_HANDLE_PREFIX + UTIL.getTimestamp(),
    unique: true,
    minlength: CONST.INPUT_LIMITS.MIN_HANDLE_LENGTH,
    maxlength: CONST.INPUT_LIMITS.MAX_HANDLE_LENGTH,
    trim: true,
    index: true
  },
  // user actual name
  name: {
    type: String,
    default: '',
    maxlength: CONST.INPUT_LIMITS.MAX_NAME_LENGTH,
    trim: true
  },
  // user gender | sex
  gender: {
    type: Number,
    validate: (val: number) => (val > -1)
  },
  // personal id number
  pid: {
    type: String,
    default: '',
    trim: true,
    validation: (val: string) => UTIL.isChinaPid(val) // check aginst Chinese PID
  },
  // mobile phone number
  mobile: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    validation: (val: string) => validator.isMobilePhone(val, CONFIG.DEFAULT_LOCALE)
  },
  // user email address
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    sparse: true,
    validation: (val: string) => validator.isEmail(val)
  },
  // user avatar url
  avatar: {
    type: String,
    default: ''
  },
  // user homepage background image url
  background: {
    type: String,
    default: ''
  },
  // user language preference
  locale: {
    type: String,
    minlength: 2,
    maxlength: 5,
    trim: true,
    validator: (code: string) => UTIL.isLocaleCode(code)
  },
  // current user location
  city: {
    type: String,
    trim: true
  },
  // current user location
  country: {
    type: String,
    default: CONFIG.DEFAULT_COUNTRY_CODE,
    minlength: 2,
    maxlength: 2,
    trim: true,
    validator: (code: string) => UTIL.isCountryCode(code)
  },
  // last time user updated personal information
  updated: {
    type: Number,
    required: true,
    default: () => UTIL.getTimestamp()
  },
  // user roles
  roles: {
    type: [String],
    required: true,
    default: [
      CONST.USER_ROLES.CONSUMER.MEMBER,
      CONST.USER_ROLES.CONSUMER.CONTRIBUTOR
    ]
  },
  // current user status
  status: {
    type: String,
    enum: CONST.CONSUMER_STATUSES_ENUM,
    default: CONST.STATUSES.CONSUMER.ACTIVE
  },
  // user verification
  verified: {
    type: Schema.Types.ObjectId,
    ref: 'Log'
  },
  // user verification expiration time
  expires: {
    type: Number
  },
  // linked user accounts of the same user type
  linked: {
    type: [Schema.Types.ObjectId]
  },
  // name displayed within the linked accounts
  linkname: {
    type: String,
    minlength: CONST.INPUT_LIMITS.MIN_HANDLE_LENGTH,
    maxlength: CONST.INPUT_LIMITS.MAX_HANDLE_LENGTH
  },
  // user self introduction
  intro: {
    type: String,
    minlength: 2,
    trim: true
  },
  // user viewing history
  // history: [History],
  // WeChat OpenID
  wechat: {
    type: String,
    default: '',
    trim: true
  },
  // other users
  contacts: [{
    type: Schema.Types.ObjectId,
    ref: 'Consumer'
  }],
  // user points
  points: {
    type: Number,
    default: 0
  },
  // user level
  level: {
    type: Number
  },
  // user account balance
  balance: {
    type: Number,
    default: 0
  },
  // user information retrieved
  viewCount: {
    type: Number,
    default: 0,
    validation: (val: number) => (val > -1)
  },
  // number of posts authored by user
  postCount: {
    type: Number,
    min: 0,
    default: 0
  },
  // number of events created by user
  eventCount: {
    type: Number,
    min: 0,
    default: 0
  },
  // number events signuped by user
  signupCount: {
    type: Number,
    min: 0,
    default: 0
  },
  // number of orders placed by user
  orderCount: {
    type: Number,
    min: 0,
    default: 0
  },
  // number of comments posted by user
  commentCount: {
    type: Number,
    min: 0,
    default: 0
  },
  // number of followers | fans
  totalFollowers: {
    type: Number,
    min: 0,
    default: 0
  },
  // number of followings
  totalFollowings: {
    type: Number,
    min: 0,
    default: 0
  },
  // groups user is member of
  groups: {
    type: [Schema.Types.ObjectId]
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true,
    // remove password from JSON
    transform: function(doc: any, ret: any, opt: any) {
      delete ret.password
      return ret
    }
  }
})

/**
 * Posts authored by user
 */
ConsumerSchema.virtual('posts', {
  ref: CONST.ACTION_TARGETS.POST,
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Events created by user
 */
ConsumerSchema.virtual('events', {
  ref: CONST.ACTION_TARGETS.EVENT,
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Events signuped by user
 */
ConsumerSchema.virtual('signups', {
  ref: CONST.ACTION_TARGETS.SIGNUP,
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Orders placed by user
 */
ConsumerSchema.virtual('orders', {
  ref: CONST.ACTION_TARGETS.ORDER,
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Comments posted by user
 */
ConsumerSchema.virtual('comments', {
  ref: CONST.ACTION_TARGETS.COMMENT,
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Reminders created by user
 */
ConsumerSchema.virtual('reminders', {
  ref: CONST.ACTION_TARGETS.REMINDER,
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Likes
 */
ConsumerSchema.virtual('likes', {
  ref: CONST.ACTION_MODELS.LIKE,
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Dislikes
 */
ConsumerSchema.virtual('dislikes', {
  ref: CONST.ACTION_MODELS.DISLIKE,
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Saves
 */
ConsumerSchema.virtual('saves', {
  ref: CONST.ACTION_MODELS.SAVE,
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Dislikes
 */
ConsumerSchema.virtual('shares', {
  ref: CONST.ACTION_MODELS.SHARE,
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Downloads
 */
ConsumerSchema.virtual('downloads', {
  ref: CONST.ACTION_MODELS.DOWNLOAD,
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

/**
 * Followers
 */
ConsumerSchema.virtual('followers', {
  ref: CONST.ACTION_MODELS.FOLLOW,
  localField: '_id',
  foreignField: 'following',
  justOne: false
})

/**
 * Followings
 */
ConsumerSchema.virtual('followings', {
  ref: CONST.ACTION_MODELS.FOLLOW,
  localField: '_id',
  foreignField: 'follower',
  justOne: false
})

/**
 * Balances user account
 *
 * @class ConsumerSchema
 * @method addToBalance
 * @param {number} subTotal
 * @returns {number}
 */
ConsumerSchema.methods.addToBalance = function(subTotal: number): number {
  this.balance += subTotal
  this.save()

  return this.balance
}

/**
 * Hash incoming password with salt and
 * compare it to stored password hash
 *
 * @class ConsumerSchema
 * @method comparePassword
 * @param {string} candidatePassword
 * @param {function} callback
 * @returns {void}
 */
ConsumerSchema.methods.comparePassword = function(candidatePassword: string, callback: Function): void {
  bcrypt
  .compare(candidatePassword, this.password, (err: Error, isMatch: boolean) => {
    if (err) { return callback(err) }
    callback(null, isMatch)
  })
}

ConsumerSchema.pre('save', function(next: Function): void {
  let user: IConsumer = this as IConsumer

  if (!user.isModified('password')) return next()

  if (user.password) {
    // generate a salt then run callback
    bcrypt.genSalt(CONFIG.USER_SALT_ROUNDS, function(err: Error, salt: string): void {
      if (err) return next(err)

      // hash the password along with generated salt
      bcrypt.hash(user.password, salt, function(err: Error, hash: string): void {
        if (err) return next(err)

        // override the cleartext password with the hashed one
        user.password = hash
        user.updated = UTIL.getTimestamp()

        if (user.isNew) {
          user.wasNew = user.isNew
        }

        next()
      })
    })
  }
})

ConsumerSchema.pre('findOneAndUpdate', function(next: Function): void {
  ModelHelper.setUpdateTime((this as any), ['username', 'handle', 'name', 'gender', 'intro', 'mobile', 'email', 'pid', 'avatar', 'background', 'locale', 'city', 'country'])
  next()
})

export { IConsumer }

export default model<IConsumer>('Consumer', ConsumerSchema)
