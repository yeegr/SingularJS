import { Dispatch } from 'redux'

import * as ACTIONS from './userConstants'
import { CONST, FETCH } from '@common'

let storageEngine: any = global.storageEngine,
  storageType: string = CONST.STORAGE_TYPES.ASYNC

interface ICreds {
  mobile?: string
  wechat?: string
  device?: any
}

interface IAction {
  type: string
  message?: string
  action?: string

  token?: string
  user?: any

  mobile?: string

  wechat_data?: any
  creds?: ICreds
}

// check user login state
const _isLoggedIn = (token: string, user: any): IAction => {
  return {
    type: ACTIONS.IS_LOGGED_IN,
    token,
    user
  }
}

const _isLoggedOut = (): IAction => {
  return {
    type: ACTIONS.IS_LOGGED_OUT
  }
}

export const logIn = () => {
  return (dispatch: Dispatch) => {
    switch (storageType) {
      case CONST.STORAGE_TYPES.ASYNC:
        storageEngine
        .multiGet([
          CONST.ACCESS_TOKEN,
          CONST.USER
        ])
        .then((arr: string[][]) => {
          if (arr[0][1] && arr[1][1]) {
            let token = arr[0][1],
              user = JSON.parse(arr[1][1])

            dispatch(_isLoggedIn(token, user))
          } else {
            dispatch(_isLoggedOut())
          }
        })
      break

      case CONST.STORAGE_TYPES.LOCAL:
        if (storageEngine.getItem(CONST.ACCESS_TOKEN)) {
          let token = storageEngine.getItem(CONST.ACCESS_TOKEN),
            user = JSON.parse(storageEngine.getItem(CONST.USER))

          dispatch(_isLoggedIn(token, user))
        } else {
          dispatch(_isLoggedOut())
        }
      break
    }
  }
}

// toggle login view
export const showLogin = (): IAction => {
  return {
    type: ACTIONS.SHOW_LOGIN
  }
}

export const hideLogin = (): IAction => {
  return {
    type: ACTIONS.HIDE_LOGIN
  }
}

// submit mobile number for verification
const _submitMobileRequest = (): IAction => {
  return {
    type: ACTIONS.SUBMIT_MOBILE_REQUEST
  }
}

const _submitMobileSuccess = (): IAction => {
  return {
    type: ACTIONS.SUBMIT_MOBILE_SUCCESS
  }
}

const _submitMobileFailure = (message: string): IAction => {
  return {
    type: ACTIONS.SUBMIT_MOBILE_FAILURE,
    message
  }
}

export const submitMobileNumber = (mobile: string, action: string) => {
  let config = Object.assign({}, FETCH.POST, {
    body: JSON.stringify({
      mobile,
      action
    })
  })

  return (dispatch: Dispatch) => {
    dispatch(_submitMobileRequest())

    return fetch(global.apiUrl + 'login/totp', config)
      .then((res: Response) => {
        if (res.status === 201) {
          dispatch(_submitMobileSuccess())
        } else {
          dispatch(_submitMobileFailure(res.statusText))
          return Promise.reject(res)
        }
      })
      .catch((err) => console.log(err))
  }
}
/*
// reset mobile verification error message
export const resetVerificationError = () => {
  return {
    type: ACTIONS.RESET_MOBILE_TOTP_ERROR
  }
}

// verify mobile number against sms code
const _verifyMobileRequest = (): IAction => {
  return {
    type: ACTIONS.VERIFY_MOBILE_REQUEST
  }
}

const _verifyMobileSuccess = (mobile: string): IAction => {
  return {
    type: ACTIONS.VERIFY_MOBILE_SUCCESS,
    mobile
  }
}

const _verifyMobileFailure = (message: string): IAction => {
  return {
    type: ACTIONS.VERIFY_MOBILE_FAILURE,
    message
  }
}

export const verifyMobileNumber = (mobile: string, vcode: string, action: string) => {
  let config = Object.assign({}, FETCH.PUT, {
    body: JSON.stringify({
      mobile,
      vcode,
      action
    })
  })
  
  return (dispatch: Dispatch, getState: Function) => {
    dispatch(_verifyMobileRequest())

    return fetch(global.apiUrl + 'login/totp', config)
      .then((res: Response) => {
        if (res.status === 201) {
          return res.json()
        } else {
          dispatch(_verifyMobileFailure(res.statusText))
          return Promise.reject(res)
        }
      })
      .then((data) => {
        if (data.verified) {
          dispatch(_verifyMobileSuccess(mobile))
          dispatch(loginUser(getState().login.creds))
        } else {
          dispatch(verifyMobileFailure(data.error))
        }
      })
  }
}


// get WeChat authorization
export const wechatAuthRequest = (action: string): IAction => {
  return {
    type: ACTIONS.WECHAT_AUTH_REQUEST,
    action
  }
}

export const wechatAuthWaiting = (): IAction => {
  return {
    type: ACTIONS.WECHAT_AUTH_WAITING
  }
}

export const wechatAuthSuccess = (wechat_token: string): IAction => {
  return (dispatch) => {
    dispatch(getWeChatUserInfo(wechat_token))

    return {
      type: ACTIONS.WECHAT_AUTH_SUCCESS
    }
  }
}

export const wechatAuthFailure = (message: string): IAction => {
  return {
    type: ACTIONS.WECHAT_AUTH_FAILURE,
    message
  }
}

const wechatOpenIdSuccess = (wechat_data: any): IAction => {
  return {
    type: ACTIONS.WECHAT_OPENID_SUCCESS,
    wechat_data
  }
}

const wechatOpenIdFailure = (message: string): IAction => {
  return {
    type: ACTIONS.WECHAT_OPENID_FAILURE,
    message
  }
}

const getWeChatUserInfo = (token: string) => {
  return (dispatch: Dispatch, getState: any) => {
    return fetch(global.assetUrl + 'wechat/info/' + token)
      .then((res: Response) => {
        return res.json()
      })
      .then((wechat) => {
        let state = getState().login

        switch (state.action) {
          case CONST.ACCOUNT_ACTIONS.LOGIN:
            dispatch(loginUser(wechat))
          break
          
          case CONST.ACCOUNT_ACTIONS.BIND:
            dispatch(updateUser(state.user._id, {
              wechat: wechat.wechat
            }))
          break
        }

        dispatch(wechatOpenIdSuccess(wechat))
      })
      .catch((err) => dispatch(wechatOpenIdFailure(err)))
  }
}

// complete sign-up process
export const showMobileLogin = () => {
  return {
    type: ACTIONS.SHOW_MOBILE_LOGIN
  }
}

const _completeSignup = (creds: ICreds) => {
  let action: any

  if (creds.mobile) {
    action = wechatAuthRequest(CONST.ACCOUNT_ACTIONS.SIGNUP)
  }

  if (creds.wechat) {
    action = showMobileLogin()
  }

  return (dispatch: Dispatch) => {
    dispatch(action)
  }
}

// login user
const _loginRequest = (creds: ICreds): IAction => {
  return {
    type: ACTIONS.LOGIN_REQUEST,
    creds
  }
}

const _loginSuccess = (user: any): IAction => {
  return {
    type: ACTIONS.LOGIN_SUCCESS,
    token: user.token,
    user
  }
}

const _loginFailure = (message: string): IAction => {
  return {
    type: ACTIONS.LOGIN_FAILURE,
    message
  }
}

export const loginUser = (creds: ICreds) => {
  creds.device = global.device

  let config = Object.assign({}, FETCH.POST, {
    body: JSON.stringify(creds)
  })

  return (dispatch: Dispatch) => {
    dispatch(_loginRequest(creds))

    return fetch(global.apiUrl + 'login', config)
      .then((res) => {
        if (res.status === 404) {
          dispatch(_completeSignup(creds))
        } else {
          return res.json()
        }
      })
      .then((res) => {
        if (res.token && res._id) {
          dispatch(_storeUser(res, 'LOGIN'))
        } else {
          dispatch(_loginFailure(res.message))
          return Promise.reject(res)
        }
      })
      .catch((err) => dispatch(_loginFailure(err)))
  }
}

// get user information
const _storeUserSuccess = (user: any): IAction => {
  return {
    type: ACTIONS.STORE_USER_SUCCESS,
    token: user.token,
    user
  }
}

const _storeUserFailure = (message: string): IAction => {
  return {
    type: ACTIONS.STORE_USER_FAILURE,
    message
  }
}

const _storeUser = (user: any, action: string) => {
  return (dispatch: Dispatch) => {
    switch (storageType) {
      case CONST.STORAGE_TYPES.ASYNC:
        storageEngine
        .multiSet([
          [CONST.ACCESS_TOKEN, JSON.stringify(user.token)],
          [CONST.USER, JSON.stringify(user)]
        ])
        .then(() => {
          dispatch(_storeUserSuccess(user))
        })
        .catch((err: Error) => {
          dispatch(_storeUserFailure(err.message))
        })
      break

      case CONST.STORAGE_TYPES.LOCAL:
        storageEngine.setItem(CONST.ACCESS_TOKEN, JSON.stringify(user.token))
        storageEngine.setItem(CONST.USER, JSON.stringify(user))
        dispatch(_storeUserSuccess(user))
      break
    }
  }
}
*/