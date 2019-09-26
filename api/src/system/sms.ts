import * as AliyunSMSClient from '@alicloud/sms-sdk'

import { CONFIG } from '@common'

const { COMPANY_NAME,
  SMS_PROVIDER,
  ALIYUN_SMS_ACCESS_ID,
  ALIYUN_SMS_ACCESS_KEY
} = CONFIG

class SMS {
  client: any
  content: any
  send: Function

  constructor(message: any) {
    switch (SMS_PROVIDER) {
      case 'ALIYUN':
        this.client = new AliyunSMSClient({
          ALIYUN_SMS_ACCESS_ID,
          ALIYUN_SMS_ACCESS_KEY
        })

        this.content = {
          PhoneNumbers: message.mobile,
          SignName: COMPANY_NAME,
          TemplateCode: message.template,
          TemplateParam: `{"code": "` + message.code + `"}`
        }

        this.send = this.sendToAliyun
      break
    }    
  }

  public sendToAliyun = () => {
    return this.client.sendSMS(this.content)
  }
}

export default SMS
