/** 
 * Interface for server endpoints
 * 
 * @interface IServers
*/
interface IServers {
  [key: string]: {
    [key: string]: string
  }
}

const HTTP_PROTOCOL: string = 'http://'
const PRODUCTION_SERVER: string = 'singularjs.com/'
const STAGING_SERVER: string = 'http://lab.singularjs.com/'
const DEV_SERVER: string = 'http://localhost'

/**
 * Server endpoints
 * 
 * @constant ENV
 * @type {IServers}
 */
export const ENV: IServers = {
  production: {
    CODE_PUSH: '',
    API_SERVER: HTTP_PROTOCOL + 'api' + PRODUCTION_SERVER,
    UPLOAD_SERVER: HTTP_PROTOCOL + 'upload' + PRODUCTION_SERVER,
    STATIC_SERVER: HTTP_PROTOCOL + 'static' + PRODUCTION_SERVER,
    PLATFORM_SERVER: HTTP_PROTOCOL + 'platform' + PRODUCTION_SERVER
  },
  staging: {
    CODE_PUSH: '',
    API_SERVER: STAGING_SERVER + 'api/',
    UPLOAD_SERVER: STAGING_SERVER + 'upload/',
    STATIC_SERVER: STAGING_SERVER + 'static/',
    PLATFORM_SERVER: STAGING_SERVER + 'platform/'
  },
  development: {
    CODE_PUSH: '',
    API_SERVER: DEV_SERVER + ':3000/api/v1/',
    UPLOAD_SERVER: DEV_SERVER + ':3001/',
    STATIC_SERVER: 'http://static/',
    CONSUMER_SERVER: DEV_SERVER + ':8080/',
    PROVIDER_SERVER: DEV_SERVER + ':8081/',
    PLATFORM_SERVER: DEV_SERVER + ':8082/'
  }
}