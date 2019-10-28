import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import promise from 'redux-promise'
import thunk from 'redux-thunk'

import rootReducer from './reducers'

const logger = createLogger(),
  createStoreWithMiddleware = applyMiddleware(
    logger,
    promise,
    thunk
  )(createStore)

export default function configureStore(initialState: any) {
  return createStoreWithMiddleware(
    rootReducer,
    initialState
  )
}