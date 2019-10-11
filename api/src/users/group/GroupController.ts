import { NextFunction, Request, RequestHandler, Response, Router } from 'express'
import { Schema, Model } from 'mongoose'

import { CONST, ERRORS, SERVERS, UTIL } from '@common'
import { Logger, Err, MISC } from '@modules'
import * as ModelHelper from '@modelHelpers'
import * as UserHelper from '@users/_userHelpers'

import IGroup, { IMember } from '../group/IGroup'
import IUser from '@users/IUser'
import GroupModel from './GroupModel'

/**
 * Creates single new entry
 *
 * @export
 * @func create
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
export function create(req: Request, res: Response): void {
  const [creator, creatorRef] = UserHelper.getLoginedUser(req),
    title: string = req.body.title

  // verify logined user
  if (!creator || validator.isEmpty(creatorRef)) {
    res.status(422).json({ code: ERRORS.USER.GROUP_CREATOR_REQUIRED })
  // check if content has title
  } else if (!title || validator.isEmpty(title)) {
    res.status(422).json({ code: ERRORS.USER.GROUP_TITLE_REQUIRED })
  } else {
    const [UserModel, DataModel] = ModelHelper.getModels(req)

    const data: IGroup = new GroupModel(Object.assign({}, {
        title: req.body.title,
        updated: UTIL.getTimestamp(),
        members: [{
          user: creator,
          userRef: creatorRef,
          isCreator: true,
          isManager: true
        }]
      }))

    let log: any = {
      creator,
      creatorRef,
      targetRef: CONST.USER_TYPES.GROUP,
      action: CONST.USER_ACTIONS.COMMON.CREATE,
      ua: req.body.ua || req.ua
    }

    data
    .save()
    .then((group: IGroup) => {
      res.status(201).json(group)
      log.target = group._id

      return UserModel.findByIdAndUpdate(creator, {"$push": {"groups": group._id}})
    })
    .then((user: IUser) => {
      new Logger(log)
    })
    .catch((err: Error) => {
      new Err(res, err, log)
    })
  }
}

export function update(req: Request, res: Response):void {

}

export function add(req: Request, res: Response):void {

}

export function invite(req: Request, res: Response):void {

}

export function join(req: Request, res: Response):void {

}

export function kick(req: Request, res: Response):void {

}

export function remove(req: Request, res: Response):void {

}


export function transfer(req: Request, res: Response):void {

}



/**
 * Creates standard routes for entry
 * 
 * @func createRoutes
 * @param {Router} router
 * @param {RequestHandler} auth
 * @param {RequestHandler} setRouteVar
 * @return {void}
 */
export function createRoutes(router: Router, auth: RequestHandler, setRouteVar: RequestHandler): void {
  // list route
  // router.get('/', setRouteVar, list)

  // single entry route
  // router.get('/:_id', setRouteVar, get)

  // create route
  router.post('/', auth, setRouteVar, create)

  // update route
  router.patch('/:_id', auth, setRouteVar, update)

  // delete route
  router.delete('/:_id', auth, setRouteVar, remove)  

  // add member route
  router.patch('/:_id', auth, setRouteVar, add)

  // invite user route
  router.post('/:_id', auth, setRouteVar, invite)  

  // kick member route
  router.post('/:_id', auth, setRouteVar, kick)  

  // user join as member route
  router.post('/:_id', auth, setRouteVar, join)  
}