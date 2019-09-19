import dev from '../../config/development/api.env'
import dist from '../../config/production/api.env'

import * as UTIL from './modules/util'

let txt: string = (process.env.NODE_ENV === 'production') ? dist : dev,
  env = UTIL.readEnv(txt),
  API_PORT: string = env.API_PORT

export default API_PORT
