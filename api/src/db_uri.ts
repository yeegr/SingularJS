import saslprep from 'saslprep'

import app from '../../config/shared/app.env'
import dev from '../../config/development/db.env'
import dist from '../../config/production/db.env'

import { UTIL } from './modules/common'

let txt = (process.env.NODE_ENV === 'production') ? dist : dev,
  env = UTIL.readEnv(txt),
  appTitle = UTIL.readEnv(app).APP_TITLE,
  AUTH: string = (env.USER_NAME.length > 0) ? env.USER_NAME + ":" + env.USER_PASSWORD + "@" : "",
  MONGODB_URI: string = "mongodb://" + AUTH + appTitle + "-db" + ":" + env.DB_PORT + "/" + env.DB_NAME

export default MONGODB_URI