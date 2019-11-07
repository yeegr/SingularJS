import {AppRegistry} from 'react-native'
import App from './src/mobile/wrapper.mobile'
import {name as appName} from './app.json'

AppRegistry.registerComponent(appName, () => App)
