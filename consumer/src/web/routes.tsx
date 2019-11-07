import React from 'react'
import {
  Switch,
  Route,
  Link
} from 'react-router-dom'

import App from './components/app'
import About from './components/about'

export default (
  <Switch>
    <Route exact path="/">
      <App />
    </Route>
    <Route path="/about">
      <About />
    </Route>
  </Switch>
)