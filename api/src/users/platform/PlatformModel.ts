import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'
import moment from 'moment-timezone'
import validator from 'validator'

import { CONFIG, CONST, UTIL } from '@common'
import * as ModelHelper from '@modelHelpers'

import IPlatform from './IPlatform'

/**
 * @class Platform
 * @mixes { PlatformSchema.methods }
 */
let PlatformSchema: Schema = new Schema({
  // user type
  ref: {
    type: String,
    required: true,
    default: CONST.USER_TYPES.PLATFORM,
    enum: [CONST.USER_TYPES.PLATFORM]
  },
  // user name
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: CONST.INPUT_LIMITS.MIN_USERNAME_LENGTH,
    maxlength: CONST.INPUT_LIMITS.MAX_USERNAME_LENGTH,
    trim: true,
    index: true
  },
  // user password, hashed
  password: {
    type: String,
    required: true,
    default: ''
  },
  // user handle
  handle: {
    type: String,
    default: () => CONST.PLATFORM_HANDLE_PREFIX + UTIL.getTimestamp(),
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
  // user gender || sex
  gender: {
    type: Number,
    validate: (val: number) => (val > -1)
  },
  // personal id number
  pid: {
    type: String,
    default: '',
    trim: true,
    validation: (val: string) => UTIL.isChinaPid(val) // check against Chinese PID
  },
  // mobile phone number
  mobile: {
    type: String,
    default: '',
    trim: true,
    validation: (val: string) => validator.isMobilePhone(val, CONFIG.DEFAULT_LOCALE)
  },
  // user email address
  email: {
    type: String,
    default: '',
    lowercase: true,
    trim: true,
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
    default: [CONST.USER_ROLES.PLATFORM.ADMIN]
  },
  // current user status
  status: {
    type: String,
    enum: CONST.PLATFORM_STATUSES_ENUM,
    default: CONST.STATUSES.PLATFORM.ACTIVE
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
  // number of activities completed by user
  activityCount: {
    type: Number,
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
    virtuals: true
  }
})

/** 
 * Removes password from return JSON
*/
PlatformSchema.set('toJSON', {
  transform: function(doc: any, ret: any, opt: any) {
    delete ret.password
    return ret
  }
})

/**
 * Activities handled | responded by user
 */
PlatformSchema.virtual('activities', {
  ref: 'Activity',
  localField: '_id',
  foreignField: 'handler'
})

/**
 * Hash incoming password with salt and
 * compare it to stored password hash
 *
 * @class PlatformSchema
 * @method comparePassword
 * @param {string} candidatePassword
 * @param {function} callback
 * @returns {void}
 */
PlatformSchema.methods.comparePassword = function(candidatePassword: string, callback: Function): void {
  bcrypt
  .compare(candidatePassword, this.password, (err, isMatch: boolean) => {
    if (err) { return callback(err) }
    callback(null, isMatch)
  })
}

PlatformSchema.pre('save', function(next: Function): void {
  let user: IPlatform = this as IPlatform

  if (user.isNew) {
    // generate a salt then run callback
    bcrypt.genSalt(CONFIG.USER_SALT_ROUNDS, function(err: Error, salt: string): void {
      if (err) return next(err)

      // hash the password along with generated salt
      bcrypt.hash(user.password, salt, function(err: Error, hash: string): void {
        if (err) return next(err)

        // override the cleartext password with the hashed one
        user.password = hash
        user.updated = UTIL.getTimestamp()
        next()
      })
    })
  } else {
    ModelHelper.setUpdateTime(user, ['username', 'password', 'nickname', 'name', 'gender', 'mobile', 'email', 'pid', 'avatar', 'background', 'locale', 'city', 'country'])
    user.wasNew = user.isNew

    next()
  }
})

export { IPlatform }

export default model<IPlatform>('Platform', PlatformSchema)
