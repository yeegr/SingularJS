import * as CONST from './constants'

// sensitive information not sync to git service
export * from '../../.ignored'

// retrieve and set default email server configuration from './ignored'
export const DEFAULT_PAYMENT_METHOD: string = CONST.PAYMENT_METHODS.ALIPAY
const DEFAULT_EMAIL_SERVICE: string = 'NETEASE'

import {NODEMAILER_SERVER_OPTIONS} from '../../.ignored/MailServers'
export const DEFAULT_EMAIL_SERVER_OPTIONS = NODEMAILER_SERVER_OPTIONS[DEFAULT_EMAIL_SERVICE]

export const DB_CONNECTION_RETRIES: number = 10
export const DB_CONNECTION_INTERVAL: number = 500  // milliseconds

export const COMPANY_NAME: string = '蓝光移客'
export const COMPANY_FULL_NAME: string = '北京蓝光移客信息技术有限公司'
export const PROJECT_TITLE: string = 'KidManager'

export const DEFAULT_COUNTRY_CODE: string = 'CN'
export const DEFAULT_LOCALE = 'zh-CN'
export const DEFAULT_TIMEZONE: string = 'Asia/Shanghai'
export const DEFAULT_DATETIME_FORMAT: string = 'YYYY-MM-DD HH:mm:ss'

export const COOKIE_SECRET: string = 'cookie_secret'

export const SMS_PROVIDER: string = 'ALIYUN'

export const POST_REQUIRES_APPROVAL: boolean = false
export const POST_SELF_PUBLISH_ROLE: string = CONST.USER_ROLES.CONSUMER.AUTHOR
export const PUBLIC_EVENT_REQURIES_APPROVAL: boolean = true
export const PUBLIC_EVENT_PUBLISH_ROLE: string = CONST.USER_ROLES.CONSUMER.ORGANIZER

export const USER_SALT_ROUNDS: number = 10
export const USER_SALT_CHARSET: string = 'alphanumeric'

export const TOTP_CODE_LENGTH: number = 4
export const TOTP_CODE_CHARSET: string = 'numeric'

export const DEFAULT_EVENT_MAX_ATTENDEE: number = 200
export const DEFAULT_EVENT_MIN_ATTENDEE: number = 20

export const GROUP_NAME_LENGTH: number = 10
export const GROUP_NAME_CHARSET: string = 'alphanumeric'

export const USER_PERSONAL_PATH: string = '/self'

/**
 * Default TOTP Expiration Time
 * 
 * @constant DEFAULT_TOTP_EXPIRATION
 * @type {[number, any]}
 */
export const DEFAULT_TOTP_EXPIRATION: [number, any] = [15, 'minutes']

/**
 * Replace original uploaded file names
 * 
 * @constant RANDOMIZE_UPLOAD_FILENAME
 * @type {boolean}
 */
export const RANDOMIZE_UPLOAD_FILENAME: boolean = true

/**
 * Length of new file name
 * 
 * @constant UPLOAD_FILENAME_LENGTH
 * @type {number}
 */
export const UPLOAD_FILENAME_LENGTH: number = 10

/**
 * New file name charset
 * 
 * @constant UPLOAD_FILENAME_CHARSET
 * @type {string}
 */
export const UPLOAD_FILENAME_CHARSET: string = 'alphabetic'

/**
 * Interface for JWT Secrets to Sign Users
 * 
 * @interface IJwtSecrets
 */
interface IJwtSecrets {
  [key: string]: string
  CONSUMER: string
  PROVIDER: string
  PLATFORM: string
}

/**
 * JWT Secrets
 * 
 * @constant JWT_SECRETS
 * @type {IJwtSecrets}
 */
export const JWT_SECRETS: IJwtSecrets = {
  CONSUMER: 'consumer_jwt_secret',
  PROVIDER: 'provider_jwt_secret',
  PLATFORM: 'platform_jwt_secret'
}

/**
 * Interface for User Token Expiration Time
 * 
 * @interface ITokenExpiration
 */
interface ITokenExpiration {
  [key: string]: [number, any]
  CONSUMER: [number, any]
  PROVIDER: [number, any]
  PLATFORM: [number, any]
}

/**
 * User Token Expiration Time
 * 
 * @constant USER_TOKEN_EXPIRATION
 * @type {ITokenExpiration}
 */
export const USER_TOKEN_EXPIRATION: ITokenExpiration = {
  CONSUMER: [90, 'days'],
  PROVIDER: [90, 'days'],
  PLATFORM: [90, 'days']  
}
