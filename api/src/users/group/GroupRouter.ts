import {Request, Response, NextFunction, RequestHandler, Router} from 'express'
import passport from 'passport'
import 'users/consumer/consumerAuth'

import {CONST} from '@common'

import * as GroupController from './GroupController'

/**
 * GroupRouter class
 *
 * @class GroupRouter
 */
class GroupRouter {
  router: Router

  /**
   * Constructor
   *
   * @class GroupRouter
   * @constructor
   */
  constructor() {
    this.router = Router({mergeParams: true})
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
      contentType: CONST.ACTION_TARGETS.GROUP
    }

    next()
  }

  routes() {
    GroupController.createRoutes(this.router, passport.authenticate('consumerJwt', {
      session: false
    }), this.setRouteVar)
  }
}

// export
const groupRouter = new GroupRouter()
groupRouter.routes()
const thisRouter = groupRouter.router

export default thisRouter
