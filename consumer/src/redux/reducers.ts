import {combineReducers} from 'redux'

import user from './user/userReducers'


const rootReducer = combineReducers({
  user
})

export default rootReducer