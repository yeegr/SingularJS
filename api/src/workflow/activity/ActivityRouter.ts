import {Request, Response, NextFunction, Router} from 'express'
import {Schema, Types} from 'mongoose'

import passport from 'passport'
import '@users/consumer/consumerAuth'

import {CONST, UTIL} from '@common'
import {Logger, Err} from '@modules'

import IUser from '@users/IUser'
import Activity, { IActivity} from './ActivityModel'

/**
 * ActivityRouter class
 *
 * @class ActivityRouter
 */
class ActivityRouter {
  router: Router

  /**
   * Constructor
   *
   * @class ActivityRouter
   * @constructor
   */
  constructor() {
    this.router = Router()
    this.routes()
  }
  
  /**
   * Updates entry by id
   *
   * @class CommentRouter
   * @method update
   * @param {Request} req
   * @param {Response} res
   * @return {void}
   */
  public update(req: Request, res: Response): void {
    let user: IUser = req.user as IUser,
      target = req.params.id,
      body = Object.assign({}, req.body, {
        handler: user._id,
        handlerRef: user.ref,
        processedAt: UTIL.getTimestamp()
      }),
      log = {
        creator: user._id,
        creatorRef: user.ref,
        target,
        targetRef: CONST.ACTION_TARGETS.ACTIVITY,
        action: body.action,
        ua: req.body.ua || req.ua
      }

    Activity
    .findByIdAndUpdate(target, body, {new: true})
    .then((data: IActivity) => {
      if (data) {
        data
        .save()
        .then((activity: IActivity) => {
          res.status(200).json(activity)
          new Logger(log)
        })
      } else {
        res.status(404).send()
      }
    })
    .catch((err: Error) => {
      new Err(res, err, log)
    })
  }  
  
  routes() {
    // updates specific activity
    this.router.patch('/:id', this.update)
  }
}

// export
const activityRouter = new ActivityRouter()
activityRouter.routes()
const thisRouter = activityRouter.router

export default thisRouter
