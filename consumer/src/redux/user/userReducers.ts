import * as ACTIONS from './userConstants'

const init = {
  showLogin: false
}

const userReducer = (state = init, action: string) => {
  return {
    showLogin: true
  }
}

export default userReducer