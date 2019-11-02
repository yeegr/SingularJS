import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { Provider } from 'react-redux'

import { View, Text } from 'react-native'

import configureStore from '../redux/store'
// import { CONST } from '../../../common'

import App from './components/app'

let store = configureStore({})

class Wrapper extends Component {
  constructor(props: any) {
    super(props)

    global.storageEngine = AsyncStorage
    global.storageType = 'async'
    // global.storageType = CONST.STORAGE_TYPES.ASYNC

    // console.log(CONST.ACCESS_TOKEN)
  }

  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

store.subscribe(() => {store.getState()})

export default Wrapper
