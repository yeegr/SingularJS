export * from './wechat/AppInfo'
export * from './aliyun/sms'
// export * from './MailServers'

/** 
 * content format
 *
// './wechat/AppInfo'
export CONSUMER_APP_ID: string = ''

// './aliyun/sms'
export const ALIYUN_SMS_ACCESS_ID: string = ''
export const ALIYUN_SMS_ACCESS_KEY: string = ''
export const ALIYUN_SMS_TEMPLATES: any = {
  LOGIN_SIGNUP: '',
  RESET_PASSWORD: '',
  UPDATE_MOBILE_NUMBER: ''
}

// './MailServers'
interface INodeMailer_Server_Options {
  [key: string]: any
}

export const NODEMAILER_SERVER_OPTIONS = {
  NETEASE: {
    service: '163',
    host: 'smtp.163.com',
    port: 465,
    secure: true,
    greetingTimeout: 100000,
    auth: {
      user: 'username@163.com',
      pass: 'auth_code'
    }
  }
}
*/
