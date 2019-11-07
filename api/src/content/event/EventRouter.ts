import {Request, Response, NextFunction, RequestHandler, Router} from 'express'
import passport from 'passport'
import 'users/consumer/consumerAuth'

import {Schema, Types} from 'mongoose'
import * as validator from 'validator'

import {CONST} from '@common'

import * as ContentController from '../ContentController'


import {CONFIG, ERRORS, UTIL} from '@common'
import {Logger, Err} from '@modules'

import Processor from '@workflow/processor'
import Process, { IProcess} from '@workflow/process/ProcessModel'
import Activity, { IActivity }  from '@workflow/activity/ActivityModel'

import Consumer from '@users/consumer/ConsumerModel'
import IUser from '@users/IUser'

import Event, { IEvent} from './EventModel'

/**
 * EventRouter class
 *
 * @class EventRouter
 */
class EventRouter {
  router: Router

  /**
   * Constructor
   *
   * @class EventRouter
   * @constructor
   */
  constructor() {
    this.router = Router()
  }

  /**
   * Middleware to set route variables
   *
   * @method setRouteVar
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {void}
   */
  private setRouteVar: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    req.routeVar = {
      creatorType: CONST.USER_TYPES.CONSUMER,
      userHandleKey: 'organizer',
      contentType: CONST.ACTION_TARGETS.EVENT,
      contentCounter: 'eventCount',
      keywordFields: 'title excerpt content destination'
    }

    next()
  }

  routes() {
    ContentController.createRoutes(this.router, passport.authenticate('consumerJwt', {
      session: false
    }), this.setRouteVar)
  }
}

// export
const eventRouter = new EventRouter()
eventRouter.routes()
const thisRouter = eventRouter.router

export default thisRouter
