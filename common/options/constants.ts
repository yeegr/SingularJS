/**
 * Converts object properties to Mongoose enum (string array)
 *
 * @param {any} obj
 * @returns {string[]}
 */
function obj2enum(obj: any): string[] {
  let arr: string[] = []

  for (let key in obj) {
    arr.push(obj[key])
  }

  return arr
}

/***************************
 * UPLOAD IMAGE PROCESSING *
 ***************************/

/**
 * Interface for image types
 * 
 * @interface IImageTypes
 */
interface IImageTypes {
  AVATAR: string
  PHOTO: string
}

/**
 * Image types
 * 
 * @constant IMAGE_TYPES
 * @type {IImageTypes}
 */
export const IMAGE_TYPES: IImageTypes = {
  AVATAR: 'avatar',
  PHOTO: 'photo'
}

/**
 * Suffix for thumbnail images
 * 
 * @constant THUMBNAIL
 * @type {string}
 */
export const THUMBNAIL = '.thumb'

/** 
 * .75x | ldpi    | 120dpi | 240px
 * 1x   | mdpi    | 160dpi | 320px
 * 1.5x | hdpi    | 240dpi | 480px
 * 2x   | xhdpi   | 320dpi | 720px
 * 3x   | xxhdpi  | 480dpi | 1080px
 * 4x   | xxxhdpi | 640dpi | 1440px 
*/

/**
 * Interface for different image sizes in pixels, 
 * each set is a tuple in the format of [number, number, boolean]
 * representing width, height and whether this is the default set
 * 
 * @interface IImageSizes
 */
interface IImageSizes {
  [key: string]: [number, number | null, boolean][]
  AVATAR: [number, number, boolean][]
  PHOTO: [number, number | null, boolean][] 
}

/**
 * @constant IMAGE_SIZES
 * @type {IImageSizes}
 */
export const IMAGE_SIZES: IImageSizes = {  
  AVATAR: [
    [48, 48, true],
    // for Android
    [32, 32, false],
    [48, 48, false],
    [64, 64, false],
    [96, 96, false],
    [128, 128, false],
    // for iOS
    [40, 40, false],
    [80, 80, false],
    [120, 120, false],
    // for OKII watches
    [36, 36, false],
    [46, 46, false],
    [56, 56, false],
    [148, 148, false],
    [168, 168, false],
  ],
  PHOTO: [
    [240, null, true],
    // for Android
    [320, null, false],
    [480, null, false],
    [720, null, false],
    [1080, null, false],
    [1440, null, false],
    // for iOS
    [640, null, false],  // iPhone SE
    [750, null, false],  // iPhone 6/7/8
    [1125, null, false], // iPhone X
    [1242, null, false]  // iPhone 6/7/8 Plus
  ]
}


/*************************************************
 * TOTP (Time-based One-time Password algorithm) *
 *************************************************/

/**
 * Interface for TOTP types
 * 
 * @interface ITotpTypes
 */
interface ITotpTypes {
  EMAIL: string
  SMS: string
  QR: string
}

/**
 * TOTP types
 * in key/value-pair format
 * 
 * @constant TOTP_TYPES
 * @type {ItotpTypes}
 */
export const TOTP_TYPES: ITotpTypes = {
  EMAIL: 'email',
  SMS: 'sms',
  QR: 'qr'
}

/**
 * TOTP types
 * in string array format
 * 
 * @constant TOTP_TYPES_ENUM
 * @type {string[]}
 */
export const TOTP_TYPES_ENUM: string[] = obj2enum(TOTP_TYPES)


/**********************
 * USER RELATED ITEMS *
 **********************/

/**
 * Interface for user types
 * 
 * @interface IUserTypes
 */
interface IUserTypes {
  CONSUMER: string
  PROVIDER: string
  PLATFORM: string
}

/**
 * User types, using model names for referencing
 * in key/value-pair format
 * 
 * @constant
 * @type {IUserTypes}
 */
export const USER_TYPES: IUserTypes = {
  CONSUMER: 'Consumer',
  PROVIDER: 'Provider',
  PLATFORM: 'Platform'
}

/**
 * User types
 * in string array format
 */
export const USER_TYPES_ENUM: string[] = obj2enum(USER_TYPES)

/**
 * Interface for user roles
 * 
 * @interface IUserRoles
 */
interface IUserRoles {
  CONSUMER: {
    GUEST: string
    MEMBER: string
    CONTRIBUTOR: string
    AUTHOR: string
    ORGANIZER: string
  }
  PROVIDER: {
    STAFF: string
    SUPERVISOR: string
    MANAGER: string
  }
  PLATFORM: {
    ADMIN: string
    EDITOR: string
    SUPER: string
  }
}

/**
 * User roles
 * in key/value-pair format
 * 
 * @constant USER_ROLES
 * @type {IUserRoles}
 */
export const USER_ROLES: IUserRoles = {
  CONSUMER: {
    GUEST: 'guest',
    MEMBER: 'member',
    CONTRIBUTOR: 'contributor',
    AUTHOR: 'author',
    ORGANIZER: 'organizer'
  },
  PROVIDER: {
    STAFF: 'staff',
    SUPERVISOR: 'supervisor',
    MANAGER: 'manager'
  },
  PLATFORM: {
    ADMIN: 'admin',
    EDITOR: 'editor',
    SUPER: 'super'
  }
}

/** 
 * User roles
 * in string array format
 * 
 * @constant CONSUMER_USER_ROLES_ENUM
 * @type {string[]}
 */
export const CONSUMER_USER_ROLES_ENUM: string[] = obj2enum(USER_ROLES.CONSUMER)
/**
 * @constant PROVIDER_USER_ROLES_ENUM
 * @type {string[]}
 */
export const PROVIDER_USER_ROLES_ENUM: string[] = obj2enum(USER_ROLES.PROVIDER)
/**
 * @constant PLATFORM_USER_ROLES_ENUM
 * @type {string[]}
 */
export const PLATFORM_USER_ROLES_ENUM: string[] = obj2enum(USER_ROLES.PLATFORM)

/**
 * Interface for content creator roles
 * 
 * @interface ICreatorRoles
 */
interface ICreatorRoles {
  [key: string]: string[]
  POST: string[]
  EVENT: string[]
}

/**
 * Content creator roles
 * 
 * @constant CONTENT_CREATOR_ROLES
 * @type {ICreatorRoles}
 */
export const CONTENT_CREATOR_ROLES: ICreatorRoles = {
  POST: [
    USER_ROLES.CONSUMER.CONTRIBUTOR,
    USER_ROLES.CONSUMER.AUTHOR
  ],
  EVENT: [
    USER_ROLES.CONSUMER.ORGANIZER
  ]
}


/*****************************
 * USER ACTION RELATED ITEMS *
 *****************************/

/**
 * Interface for user actions
 * 
 * @interface IUserActions
 */
interface IUserActions {
  COMMON: {
    LIST: string
    GET: string
    UNIQUE: string
    CREATE: string
    UPDATE: string
    UPLOAD: string
    DELETE: string
    LOGIN: string
    LOGOUT: string
    RESET_PASSWORD: string
  }
  CONSUMER: {
    LIKE: string
    UNDO_LIKE: string
    DISLIKE: string
    UNDO_DISLIKE: string
    SAVE: string
    UNDO_SAVE: string
    SHARE: string
    DOWNLOAD: string
    REMOVE: string
    FOLLOW: string
    UNFOLLOW: string
    SUBSCRIBE: string
    UNSUBSCRIBE: string
    SUBMIT: string
    RETRACT: string
    REPORT: string
    CHAT: string
  }
  PROVIDER: {
    ENROLL: string
    UNDO_ENROLL: string
    SUBMIT: string
    RETRACT: string
    CHAT: string
  }
  PLATFORM: {
    REQUEST: string
    HOLD: string
    CANCEL: string
    VERIFY: string
    APPROVE: string
    REJECT: string
    SUSPEND: string
  }
}

/**
 * User actions
 * in key/value-pair format
 * 
 * @constant USER_ACTIONS
 * @type {IUserActions}
 */
export const USER_ACTIONS: IUserActions = {
  COMMON: {
    LIST: 'LIST',
    GET: 'GET',
    UNIQUE: 'UNIQUE',
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    UPLOAD: 'UPLOAD',
    DELETE: 'DELETE',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    RESET_PASSWORD: 'RESET_PASSWORD'
  },
  CONSUMER: {
    LIKE: 'LIKE',
    UNDO_LIKE: 'UNDO_LIKE',
    DISLIKE: 'DISLIKE',
    UNDO_DISLIKE: 'UNDO_DISLIKE',
    SAVE: 'SAVE',
    UNDO_SAVE: 'UNDO_SAVE',
    SHARE: 'SHARE',
    DOWNLOAD: 'DOWNLOAD',
    REMOVE: 'REMOVE',
    FOLLOW: 'FOLLOW',
    UNFOLLOW: 'UNFOLLOW',
    SUBSCRIBE: 'SUBSCRIBE',
    UNSUBSCRIBE: 'UNSUBSCRIBE',
    SUBMIT: 'SUBMIT',
    RETRACT: 'RETRACT',
    REPORT: 'REPORT',
    CHAT: 'CHAT'
  },
  PROVIDER: {
    ENROLL: 'ENROLL',
    UNDO_ENROLL: 'UNDO_ENROLL',
    SUBMIT: 'SUBMIT',
    RETRACT: 'RETRACT',
    CHAT: 'CHAT'
  },
  PLATFORM: {
    REQUEST: 'REQUEST',
    HOLD: 'HOLD',
    CANCEL: 'CANCEL',
    VERIFY: 'VERIFY',
    APPROVE: 'APPROVE',
    REJECT: 'REJECT',
    SUSPEND: 'SUSPEND'
  }
}

/** 
 * User actions
 * in string array format
 * 
 * @constant CONSUMER_USER_ACTIONS_ENUM
 * @type {string[]}
 */
export const CONSUMER_USER_ACTIONS_ENUM: string[] = obj2enum(USER_ACTIONS.CONSUMER)
/**
 * @constant PROVIDER_USER_ACTIONS_ENUM
 * @type {string[]}
 */
export const PROVIDER_USER_ACTIONS_ENUM: string[] = obj2enum(USER_ACTIONS.PROVIDER)
/**
 * @constant PLATFORM_USER_ACTIONS_ENUM
 * @type {string[]}
 */
export const PLATFORM_USER_ACTIONS_ENUM: string[] = obj2enum(USER_ACTIONS.PLATFORM)

/**
 * Interface for user action targets
 * 
 * @interface IActionTargets
 */
interface IActionTargets {
  [key: string]: string
  CONSUMER: string
  PROVIDER: string
  PLATFORM: string
  POST: string
  EVENT: string
  PRODUCT: string
  ORDER: string
  COMMENT: string
  PROCESS: string
  ACTIVITY: string
}

/**
 * User action targets 
 * in key/value-pair format
 * 
 * @constant ACTION_TARGETS
 * @type {IActionTargets}
 */
export const ACTION_TARGETS: IActionTargets = {
  CONSUMER: 'Consumer',
  PROVIDER: 'Provider',
  PLATFORM: 'Platform',
  POST: 'Post',
  EVENT: 'Event',
  PRODUCT: 'Product',
  ORDER: 'Order',
  COMMENT: 'Comment',
  PROCESS: 'Process',
  ACTIVITY: 'Activity'
}

/** 
 * User action targets
 * in string array format
 * 
 * @constant ACTION_TARGETS_ENUM
 * @type {string[]}
 */
export const ACTION_TARGETS_ENUM: string[] = obj2enum(ACTION_TARGETS)

/**
 * Interface for action models
 * 
 * @interface IActionModels
 */
interface IActionModels {
  [key: string]: string
  LIKE: string
  DISLIKE: string
  SAVE: string
  SHARE: string
  DOWNLOAD: string
  FOLLOW: string
}

/**
 * Action models
 * in key/value-pair format
 * 
 * @constant ACTION_MODELS
 * @type {IActionModels}
 */
export const ACTION_MODELS: IActionModels = {
  LIKE: 'Like',
  DISLIKE: 'Dislike',
  SAVE: 'Save',
  SHARE: 'Share',
  DOWNLOAD: 'Download',
  FOLLOW: 'Follow'
}

/**
 * Action models
 * in string array format
 * 
 * @constant ACTION_MODELS_ENUM
 * @type {string[]}
 */
export const ACTION_MODELS_ENUM: string[] = obj2enum(ACTION_MODELS)


/*******************************
 * OBJECT STATUS RELATED ITEMS *
 *******************************/

/**
 * Interface for object statuses
 * 
 * @interface IStatuses
 */
interface IStatuses {
  [key: string]: {
    [key: string]: string
  }

  CONSUMER: {
    ACTIVE: string
    SUSPENDED: string
  }
  PROVIDER: {
    ACTIVE: string
    SUSPENDED: string
  }
  PLATFORM: {
    ACTIVE: string
    SUSPENDED: string
  }
  CHECKLIST: {
    EDITING: string
    ACTIVE: string
    SUSPENDED: string
    EXPIRED: string
  }
  POST: {
    EDITING: string
    PENDING: string
    APPROVED: string
    REJECTED: string
    SUSPENDED: string
    EXPIRED: string
  }
  EVENT: {
    EDITING: string
    PENDING: string
    APPROVED: string
    REJECTED: string
    SUSPENDED: string
    EXPIRED: string
  }
  EVENT_BATCH: {
    ACCEPTING: string
    FILLED: string
    PASTDUE: string
    CONCLUDED: string
    SUSPENDED: string
  }
  SIGNUP: {
    PENDING: string
    APPROVED: string
    REJECTED: string
  }
  PAYMENT: {
    PENDING: string
    PROCESSING: string
    SUCCESS: string
    VERIFIED: string
    FAILED: string
    CANCELED: string
    DUPLICATED: string
    NETWORK: string
    UNKNOWN: string
  }
  PROCESS: {
    PENDING: string
    CANCELLED: string
    FINALIZED: string
  }
}

/**
 * Object statuses 
 * in key/value-pair format
 * 
 * @constant STATUSES
 * @type {IStatuses}
 */
export const STATUSES: IStatuses = {
  CONSUMER: {
    ACTIVE: 'active',
    SUSPENDED: 'suspended'
  },
  PROVIDER: {
    ACTIVE: 'active',
    SUSPENDED: 'suspended'
  },
  PLATFORM: {
    ACTIVE: 'active',
    SUSPENDED: 'suspended'
  },
  CHECKLIST: {
    EDITING: 'editing',
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
    EXPIRED: 'expired'
  },
  POST: {
    EDITING: 'editing',
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    SUSPENDED: 'suspended',
    EXPIRED: 'expired'
  },
  EVENT: {
    EDITING: 'editing',
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    SUSPENDED: 'suspended',
    EXPIRED: 'expired'
  },
  EVENT_BATCH: {
    ACCEPTING: 'accepting',
    FILLED: 'filled',
    PASTDUE: 'pastdue',
    CONCLUDED: 'concluded',
    SUSPENDED: 'suspended'
  },
  SIGNUP: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  },
  PAYMENT: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SUCCESS: 'success',
    VERIFIED: 'verified',
    FAILED: 'failed',
    CANCELED: 'canceled',
    DUPLICATED: 'duplicated',
    NETWORK: 'network connection error',
    UNKNOWN: 'unknown'
  },
  PROCESS: {
    PENDING: 'pending',
    CANCELLED: 'cancelled',
    FINALIZED: 'finalized'
  }
}

/**
 * Object statuses 
 * in string array format
 * 
 * @constant CONSUMER_STATUSES_ENUM
 * @type {string[]}
 */
export const CONSUMER_STATUSES_ENUM = obj2enum(STATUSES.CONSUMER)
/**
 * @constant PROVIDER_STATUSES_ENUM
 * @type {string[]}
 */
export const PROVIDER_STATUSES_ENUM = obj2enum(STATUSES.PROVIDER)
/**
 * @constant PLATFORM_STATUSES_ENUM
 * @type {string[]}
 */
export const PLATFORM_STATUSES_ENUM = obj2enum(STATUSES.PLATFORM)
/** 
 * @constant CHECKLIST_STATUSES_ENUM
 * @type {string[]}
 */
export const CHECKLIST_STATUSES_ENUM = obj2enum(STATUSES.CHECKLIST)
/** 
 * @constant POST_STATUSES_ENUM
 * @type {string[]}
 */
export const POST_STATUSES_ENUM = obj2enum(STATUSES.POST)
/**
 * @constant EVENT_STATUSES_ENUM
 * @type {string[]}
 */
export const EVENT_STATUSES_ENUM = obj2enum(STATUSES.EVENT)
/**
 * @constant EVENT_BATCH_STATUSES_ENUM
 * @type {string[]}
 */
export const EVENT_BATCH_STATUSES_ENUM = obj2enum(STATUSES.EVENT_BATCH)
/**
 * @constant SIGNUP_STATUSES_ENUM
 * @type {string[]}
 */
export const SIGNUP_STATUSES_ENUM = obj2enum(STATUSES.SIGNUP)
/**
 * @constant PAYMENT_STATUSES_ENUM
 * @type {string[]}
 */
export const PAYMENT_STATUSES_ENUM = obj2enum(STATUSES.PAYMENT)

/*******************************************
 * ADMINISTRATIVE PROCESSING RELATED ITEMS *
 *******************************************/

/**
 * Interface for process types
 * 
 * @interface IProcessTypes
 */
interface IProcessTypes {
  APPROVAL: string
}

/**
 * Process types
 * in key/value-pair format
 * 
 * @constant PROCESS_TYPES
 * @type {IProcessTypes}
 */
export const PROCESS_TYPES: IProcessTypes = {
  APPROVAL: 'approval'
}

/**
 * Process types
 * in string array format
 * 
 * @constant PROCESS_TYPES_ENUM
 * @type {string[]}
 */
export const PROCESS_TYPES_ENUM = obj2enum(PROCESS_TYPES)

 /**
  * Interface for activity states
  * 
  * @interface IActivityStates
  */
interface IActivityStates {
  READY: string
  PROCESSING: string
  COMPLETED: string
}

/**
 * Activity states 
 * in key/value-pair format
 * 
 * @constant ACTIVITY_STATES
 * @type {IActivityStates}
 */
export const ACTIVITY_STATES: IActivityStates = {
  READY: 'ready',
  PROCESSING: 'processing',
  COMPLETED: 'completed'
}

/**
 * Activity states
 * in string array format
 * 
 * @constant ACTIVITY_STATES_ENUM
 * @type {string[]}
 */
export const ACTIVITY_STATES_ENUM = obj2enum(ACTIVITY_STATES)


/*******************
 * PAYMENT METHODS *
 *******************/

/**
 * Interface for payment methods
 * 
 * @interface IPaymentMethods
 */
interface IPaymentMethods {
  CASH: string
  ALIPAY: string
  WECHAT: string
  PAYPAL: string
}

/**
 * Payment methods 
 * in key/value-pair format
 * 
 * @constant PAYMENT_METHODS
 * @type {IPaymentMethods}
 */
export const PAYMENT_METHODS: IPaymentMethods = {
  CASH: 'cash',
  ALIPAY: 'Alipay',
  WECHAT: 'WeChat_Pay',
  PAYPAL: 'PayPal'
}

/**
 * Payment methods
 * in string array format
 * 
 * @constant PAYMENT_METHODS_ENUM
 * @type {string[]}
 */
export const PAYMENT_METHODS_ENUM = obj2enum(PAYMENT_METHODS)


/********************** 
 * VIEW RELATED ITEMS *
 **********************/

/**
 * Consumer user default handle prefix
 * 
 * @constant CONSUMER_HANDLE_PREFIX
 * @type {string}
 */
export const CONSUMER_HANDLE_PREFIX: string = 'User_'

/**
 * Provider user default handle prefix
 * 
 * @constant PROVIDER_HANDLE_PREFIX
 * @type {string}
 */
export const PROVIDER_HANDLE_PREFIX: string = 'User_'

/**
 * Platform user default handle prefix
 * 
 * @constant PLATFORM_HANDLE_PREFIX
 * @type {string}
 */
export const PLATFORM_HANDLE_PREFIX: string = 'Admin_'

/**
 * Default number of list items per page
 * 
 * @constant DEFAULT_PAGE_COUNT
 * @type {number}
 */
export const DEFAULT_PAGE_COUNT: number = 20

/**
 * Default number of comments to showcase
 * 
 * @constant COMMENT_SHOWCASE_COUNT
 * @type {number}
 */
export const COMMENT_SHOWCASE_COUNT: number = 3

/**
 * Consumer information opened to the public
 * 
 * @constant PUBLIC_CONSUMER_INFO
 * @type {string}
 */
export const PUBLIC_CONSUMER_INFO: string = 'handle gender avatar status points level viewCount commentCount postCount eventCount likes dislikes saves shares dowloads followers followings'

/**
 * Consumer information embeded in lists
 * 
 * @constant PUBLIC_CONSUMER_INFO_LIST
 * @type {string}
 */
export const PUBLIC_CONSUMER_INFO_LIST: string = 'handle gender avatar status points level totalFollowers viewCount postCount eventCount commentCount'

/**
 * Basic consumer information
 * 
 * @constant BASIC_USER_INFO
 * @type {string}
 */
export const BASIC_USER_INFO: string = 'handle username avatar status points level'

/**
 * Basic post information
 * 
 * @constant BASIC_POST_INFO
 * @type {string}
 */
export const BASIC_POST_INFO: string = 'title slug'

/**
 * Content (including posts and events) counters
 * 
 * @constant COUNTERS
 * @type {string}
 */
const COUNTERS: string = ' viewCount commentCount likeCount dislikeCount saveCount shareCount downloadCount'

/**
 * Number of posts shown in short lists
 * 
 * @constant CONSUMER_POST_SHOWCASE_COUNT
 * @type {number}
 */
export const CONSUMER_POST_SHOWCASE_COUNT: number = 3

/**
 * Post fields displayed within a list
 * 
 * @constant CONSUMER_POST_SHOWCASE_KEYS
 * @type {string}
 */
export const CONSUMER_POST_SHOWCASE_KEYS: string = 'slug title excerpt hero tags' + COUNTERS

/**
 * Number of events shown in short lists
 * 
 * @constant CONSUMER_EVENT_SHOWCASE_COUNT
 * @type {number}
 */
export const CONSUMER_EVENT_SHOWCASE_COUNT: number = 3

/**
 * Event fields displayed within a list
 * 
 * @constant CONSUMER_EVENT_SHOWCASE_KEYS
 * @type {string}
 */
export const CONSUMER_EVENT_SHOWCASE_KEYS: string = 'slug title excerpt hero tags' + COUNTERS

/**
 * List sort order
 * 
 * @interface ISortOrder
 */
interface ISortOrder {
  viewCount: number
  _id: number
}

/**
 * Default list sort order
 * 
 * @constant DEFAULT_SORT_ORDER
 * @type {ISortOrder}
 */
export const DEFAULT_SORT_ORDER: ISortOrder = {
  viewCount: -1,
  _id: -1
}

/**
 * Fields to show on comment's parent
 * 
 * @constant COMMENT_PARENT_FIELD_LIST
 * @type {string}
 */
export const COMMENT_PARENT_FIELD_LIST: string = 'creator slug title excerpt comments commentCount totalRating averageRating'

/**
 * Fields to show on like's parent
 * 
 * @constant LIKE_PARENT_FIELD_LIST
 * @type {string}
 */
export const LIKE_PARENT_FIELD_LIST: string = 'creator slug title excerpt likes likeCount'

/**
 * Sublists
 * 
 * @constant SUBLISTS
 * @type {string}
 */
export const SUBLISTS: string[] = ['likes', 'dislikes', 'saves', 'shares', 'downloads']

/**
 * User information not directly updatable via API
 */
export const USER_UNUPDATABLE_FIELDS: string = '_id id ref updated roles status verified expires history points level balance viewCount commentCount postCount eventCount signupCount orderCount'

/**
 * Content information not directly updatable via API
 */
export const CONTENT_UNUPDATABLE_FIELDS: string = '_id id status updated totalRating commentCount viewCount likeCount dislikeCount saveCount shareCount downloadCount'

/************************
 * DEVICE RELATED ITEMS *
 ************************/

/**
 * Interface for local storage types
 * 
 * @interface IStorageType
 */
interface IStorageType {
  ASYNC: string
  LOCAL: string
}

/**
 * Local storage types
 * in key/value-pair format
 * 
 * @constant STORAGE_TYPE
 * @type {IStorageType}
 */
export const STORAGE_TYPE: IStorageType = {
  ASYNC: 'ASYNC',
  LOCAL: 'LOCAL'
}

/**
* Interface for local storage keys
* 
* @interface IStorageKey
*/
interface IStorageKey {
  ACCESS_TOKEN: string
  USER: string
}

/**
 * Local storage keys
 * 
 * @constant STORAGE_KEY
 * @type {IStorageKey}
 */
export const STORAGE_KEY: IStorageKey = {
  ACCESS_TOKEN: 'token',
  USER: 'user'
}



/****************************
 * INPUT FORM RELATED ITEMS *
 ****************************/

/**
 * Interface for common user input limits
 * 
 * @interface IInputLimits
 */
interface IInputLimits {
  MIN_HANDLE_LENGTH: number
  MAX_HANDLE_LENGTH: number
  MIN_PASSWORD_LENGTH: number
  MAX_PASSWORD_LENGTH: number
  MIN_NAME_LENGTH: number
  MAX_NAME_LENGTH: number

  MIN_USERNAME_LENGTH: number
  MAX_USERNAME_LENGTH: number
}

/**
 * Common user input limits
 * 
 * @constant INPUT_LIMITS
 * @type {IInputLimits}
 */
export const INPUT_LIMITS: IInputLimits = {
  MIN_HANDLE_LENGTH: 2,
  MAX_HANDLE_LENGTH: 20,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 20,
  MIN_NAME_LENGTH: 0,
  MAX_NAME_LENGTH: 50,

  MIN_USERNAME_LENGTH: 6,
  MAX_USERNAME_LENGTH: 30
}

/**
 * Interface for administrative user input limits
 * 
 * @interface IPlatformLimits
 */
interface IPlatformLimits {
  MIN_USERNAME_LENGTH: number
  MAX_USERNAME_LENGTH: number
  MIN_PASSWORD_LENGTH: number
  MAX_PASSWORD_LENGTH: number
  // MIN_HANDLE_LENGTH: number
  // MAX_HANDLE_LENGTH: number
  // MIN_NAME_LENGTH: number
  // MAX_NAME_LENGTH: number

}

/**
 * Administrative user input limits
 * 
 * @constant PLATFORM_LIMITS
 * @type {IPlatformLimits}
 */
export const PLATFORM_LIMITS: IPlatformLimits = {
  MIN_USERNAME_LENGTH: INPUT_LIMITS.MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH: INPUT_LIMITS.MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH: INPUT_LIMITS.MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH: INPUT_LIMITS.MAX_PASSWORD_LENGTH
}