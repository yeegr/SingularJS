import nodemailer, { Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer'

import { CONFIG } from '@common'

class Emailer {
  serverOptions: any
  mailOptions: SendMailOptions
  transporter: Transporter

  constructor(mailOptions: SendMailOptions, serverOptions: any = CONFIG.DEFAULT_EMAIL_SERVER_OPTIONS) {
    if (!mailOptions.hasOwnProperty('from')) {
      mailOptions.from = serverOptions.auth.user
    }

    this.transporter = nodemailer.createTransport(serverOptions)
    this.mailOptions = mailOptions
  }

  public send = () => {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(this.mailOptions, (err: Error, info: SentMessageInfo) => {
        if (err) {
          reject(err)
        }

        if (info && info.response.indexOf('250') < 0) {
          reject(err)
        }

        this.transporter.close()
        resolve()
      })
    })
  }
}

export default Emailer
