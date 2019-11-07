import React, { Component} from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'

import configureStore from '../redux/store'
import {CONST} from '@common'

import routes from './routes'

import './favicon.ico'

let store = configureStore({}),
  wrapper = document.querySelector('wrapper')

global.storageEngine = localStorage
global.storageType = CONST.STORAGE_TYPES.ASYNC

store.subscribe(() => {store.getState()})

// render in html
render((
  <Provider store={store}>
    <Router>
      {routes}
    </Router>
  </Provider>
), wrapper)
