import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import colors from 'colors'
import cookieParser from "cookie-parser"
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import passport from 'passport'
import path from 'path'
import { UAParser } from 'ua-parser-js'

import { CONFIG } from '@common'

import db_uri from './config/db_uri'

import _HelperRouter from './helper'
import AdminRouter from './routers/_admin'

import ConsumerRouter from '@users/consumer/ConsumerRouter'

import EventRouter from '@content/event/EventRouter'
import PostRouter from '@content/post/PostRouter'

import ActionRouter from '@actions/ActionRouter'
import CommentRouter from '@actions/comment/CommentRouter'

// use native ES6 promises instead of mongoose promise library
(<any>mongoose).Promise = global.Promise

/**
 * Server class
 *
 * @class Server
 */
class Server {
  public app: express.Application

  /**
   * Connect to the database
   *
   * @class Server
   * @constructor
   */
  constructor() {
    // create Express server
    this.app = express()

    // connecting to the database
    this.connect()

    // configure the middleware
    this.config()

    // configure the routes
    this.routes()
  }

  /**
   * Connect to the database
   *
   * @class Server
   * @method config
   * @return {void}
   * @memberof Server
   */
  public connect(): void {
    let dbConn = () => mongoose.connect(db_uri, {
      autoReconnect: true,
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    // CONNECTION EVENTS
    let db = mongoose.connection,
      connCounter = 0

    db.on('connecting', () => {
      console.log(colors.yellow('Connecting database...'))
    })

    db.on('connected', () => {
      console.log(colors.green('Database connected at'), colors.gray(db_uri))
    })

    db.on('error', (err: Error) => {
      console.log(colors.red('Database connection error: ' + err))

      // db service may not be ready before API server starts, 
      // retry connection if refused
      if (err.message.indexOf('ECONNREFUSED') > -1 && connCounter < CONFIG.DB_CONNECTION_RETRIES) {
        connCounter++
        console.log(`Retry connection number ${connCounter} in ${Math.round(CONFIG.DB_CONNECTION_INTERVAL / 100) / 10}s`)
        setTimeout(dbConn, CONFIG.DB_CONNECTION_INTERVAL)
      }
    })

    db.on('disconnected', () => {
      console.log(colors.magenta('Database disconnected'))
    })

    db.on('reconnected', () => {
      console.log(colors.green('Database reconnected'))
    })

    db.on('timeout', () => {
      console.log(colors.magenta('Database connection timeout'))
    })

    db.once('open', () => {
      console.log(colors.green('Database connection opened'))
    })

    // event handler for ECONNREFUSED
    process.on('unhandledRejection', (err: any, p: Promise<any>): void => {
      console.log(err.message)
    })

    // connect to mongodb via mongoose
    dbConn()
  }

  /**
   * Configures application middleware
   *
   * @class Server
   * @method config
   * @return {void}
   * @memberof Server
   */
  public config(): void {
    // mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true
    }))

    // mount json form parser
    this.app.use(bodyParser.json())

    // mount cookie parker
    this.app.use(cookieParser())

    // mount logger
    this.app.use(morgan('dev'))
    
    // mount compression
    this.app.use(compression())
    
    // mount helmet
    this.app.use(helmet())
    
    // initialize passport
    this.app.use(passport.initialize())
    
    // mount cors
    this.app.use(cors())

    // mount ua info
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      let userAgent = req.headers['user-agent']

      if (userAgent) {
        let ua = new UAParser(userAgent.toString());
        req.ua = ua.getResult()
      } else {
        req.ua = null
      }

      next()
    })

    // // cors
    // this.app.use((req: Request, res: Response, next: NextFunction) => {
    //   res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
    //   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, PURGE')
    //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials')
    //   res.header('Access-Control-Allow-Credentials', 'true')
    //   next()
    // })
  }

  /**
   * Configures routes
   *
   * @class Server
   * @method routes
   * @return {void}
   */
  private routes(): void {
    let router: express.Router
    router = express.Router()

    // use router middleware
    this.app.use('/', router)

    const root = '/api/v1/'

    // helper router - not for production
    this.app.use(root + 'helpers', _HelperRouter)

    // consumer router - use 'users' in url following common practices
    this.app.use(root, ConsumerRouter)

    // post router
    this.app.use(root + 'posts', PostRouter)

    // event router
    this.app.use(root + 'events', EventRouter)

    // // service / prodcut provider router
    // this.app.use(root + 'providers', ProviderRouter)

    // // store router
    // this.app.use(root + 'stores', StoreRouter)

    // // product category router
    // this.app.use(root + 'categories', CategoryRouter)

    // // product router
    // this.app.use(root + 'products', ProductRouter)

    // // order router
    // this.app.use(root + 'orders', OrderRouter)

    // // validation router
    // this.app.use(root + 'validates', ValidateRouter)

    // // action router
    // this.app.use(root + 'actions', ActionRouter)

    // // comment router
    // this.app.use(root + 'comments', CommentRouter)

    // // platform administrator router
    // this.app.use(root + 'admin', AdminRouter)
  }
}

export default new Server().app
