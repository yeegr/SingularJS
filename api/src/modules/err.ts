import {Response} from 'express'

import {ERRORS} from '@common'

import ErrModel, { IErr} from '../system/err/ErrModel'

class ErrLogger {
  constructor(res: Response, err: any, log: any) {
    let error: IErr = this.parseError(err, log)

    error
    .save()
    .then((data: IErr) => {
      res.status(data.status).json({
        code: data.code,
        key: data.key,
        message: data.message
      })
    })
    .catch((err: Error) => {
      console.log(err)
    })
  }

  private parseError = (err: any, log: any): IErr => {
    let status = 500,
      code = null,
      key = '',
      message = ''

    switch (err.code) {
      case 11000:
        status = 409
        code = 11000
        key = err.message.split(':')[2].trim().split(' ')[0].split('_')[0]
        message = ERRORS.LOGIN.DUPLICATED_USER_INFORMATION
      break

      default:
        message = err
      break
    }

    return new ErrModel(Object.assign({}, log, {
      status,
      code,
      key,
      message
    }))
  }
}

export default ErrLogger
