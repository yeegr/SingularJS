import { RequestHandler, Request, Response, NextFunction, Router } from 'express'
import passport from 'passport'
import 'users/consumer/consumerAuth'

import { CONST } from '@common'

import * as ContentController from '@content/ContentController'

/**
 * ReminderRouter class
 *
 * @class ReminderRouter
 */
class ReminderRouter {
  router: Router

  /**
   * Constructor
   *
   * @class ReminderRouter
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
      userHandleKey: 'creator',
      contentType: CONST.ACTION_TARGETS.REMINDER,
      // contentCounter: 'reminderCount',
      keywordFields: 'title description'
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
const reminderRouter = new ReminderRouter()
reminderRouter.routes()
const thisRouter = reminderRouter.router

export default thisRouter
