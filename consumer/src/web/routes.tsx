import React from 'react'
import {
  Switch,
  Route,
  Link
} from 'react-router-dom'

import App from './components/app'

export default (
  <Switch>
    <Route exact path="/">
      <App />
    </Route>
  </Switch>
)