import { NextFunction, Request, RequestHandler, Response, Router } from 'express'
import { NativeError, Schema, Model } from 'mongoose'
import validator from 'validator'

import { CONST, ERRORS, SERVERS, UTIL } from '@common'
import { Logger, Err, MISC } from '@modules'
import * as ModelHelper from '@modelHelpers'
import * as UserHelper from '@users/_userHelpers'

import IUser from '@users/IUser'
import GroupModel, { IGroup } from './GroupModel'
import MemberModel, { IMember } from './MemberModel'
import { request } from 'https'

/**
 * List search results
 *
 * @func list
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
export function list(req: Request, res: Response): void {
  const [id, ref] = UserHelper.getLoginedUser(req),
    UserModel: Model<IUser> = ModelHelper.getModelFromName(ref)

  UserModel
  .findById(id)
  .select('handle groups')
  .populate({
    path: 'groups',
    model: GroupModel
  })
  .lean()
  .exec()
  .then((data: IUser[]) => {
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(404).send()
    }
  })
  .catch((err: Error) => {
    res.status(res.statusCode).send()
    console.log(err)
  })
}

/**
 * Gets single entry by param of 'slug'
 *
 * @export
 * @func get
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
export function get(req: Request, res: Response): void {
  GroupModel
  .findOne({
    slug: req.params.slug,
    status: CONST.STATUSES.GROUP.ACTIVE
  })
  .populate({
    path: 'members.user',
    model: 'Consumer',
    select: CONST.BASIC_USER_INFO
  })
  .exec()
  .then((data: IGroup) => {
    if (data) {
      res.status(200).json(data)        
    } else {
      res.status(404).send()
    }
  })
  .catch((err: Error) => {
    res.status(res.statusCode).send()
    console.log(err)
  })
}

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
    const UserModel = ModelHelper.getModelFromName(creatorRef)

    const data: IGroup = new GroupModel(Object.assign({}, {
      creator,
      creatorRef,
      title: req.body.title,
      updated: UTIL.getTimestamp(),
      members: [{
        userId: creator,
        userRef: creatorRef,
        isCreator: true,
        isManager: true,
        alias: req.user.handle
      }]
    }))

    let log: any = {
      creator,
      creatorRef,
      targetRef: CONST.ACTION_TARGETS.GROUP,
      action: CONST.USER_ACTIONS.COMMON.CREATE,
      ua: req.body.ua || req.ua
    }

    data
    .save()
    .then((group: IGroup) => {
      res.status(201).json(group)
      log.target = group._id

      return UserModel.findByIdAndUpdate(creator, {$push: {"groups": group._id}})
    })
    .then((user: IUser) => {
      new Logger(log)
    })
    .catch((err: Error) => {
      new Err(res, err, log)
    })
  }
}
  
/**
 * Updates entry by params of 'slug'
 *
 * @export
 * @func update
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
export function update(req: Request, res: Response):void {
  const [creator, creatorRef] = UserHelper.getLoginedUser(req)

  let log: any = {
    creator,
    creatorRef,
    action: CONST.USER_ACTIONS.COMMON.UPDATE,
    targetRef: CONST.ACTION_TARGETS.GROUP,
    ua: req.body.ua || req.ua
  }

  GroupModel
  .findOne({
    slug: req.params.slug,
    status: CONST.STATUSES.GROUP.ACTIVE
  })
  .then((group: IGroup) => {
    let self: IMember = group.members.filter(member => member.userRef === creatorRef && (<any>member.userId).equals(creator))[0]

    if (!self) {
      res.status(404).send(ERRORS.GROUP.NOT_GROUP_MEMBER)
    } else if (!self.isManager) {
      res.status(404).send(ERRORS.GROUP.NOT_GROUP_MANAGER)
    } else {
      let input = req.body

      if (input.title) {
        group.title = input.title
      }

      if (input.settings) {
        if (input.settings.membership) {
          group.settings.membership = input.settings.membership
        }
      }

      return group.save()
    }
  })
  .then((group: IGroup) => {
    res.status(200).json(group)
    new Logger(log)
  })
  .catch((err: Error) => {
    res.status(res.statusCode).send()
    console.log(err)
  })
}

/**
 * Deletes entry by params of 'slug'
 *
 * @export
 * @func remove
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
export function remove(req: Request, res: Response):void {
  const [creator, creatorRef] = UserHelper.getLoginedUser(req)

  let log: any = {
    creator,
    creatorRef,
    action: CONST.USER_ACTIONS.COMMON.DELETE,
    targetRef: CONST.ACTION_TARGETS.GROUP,
    ua: req.body.ua || req.ua
  }

  GroupModel
  .findOne({
    slug: req.params.slug,
    status: CONST.STATUSES.GROUP.ACTIVE
  })
  .then((group: IGroup) => {
    let self: IMember = group.members.filter(member => member.userRef === creatorRef && (<any>member.userId).equals(creator))[0]

    if (!self) {
      res.status(404).send(ERRORS.GROUP.NOT_GROUP_MEMBER)
    } else if (!self.isManager) {
      res.status(404).send(ERRORS.GROUP.NOT_GROUP_MANAGER)
    } else if (group.members.length > 1) {
      // kick every member except manager to proceed
      res.status(404).send(ERRORS.GROUP.NOT_EMPTY)
    } else {
      return group.delete()
    }
  })
  .then((group: IGroup) => {
    const UserModel = ModelHelper.getModelFromName(creatorRef)

    return UserModel
    .findByIdAndUpdate(creator, {
      $pullAll: {"groups": [group._id]}
    })
  })
  .then(() => {
    res.status(204).end()
    new Logger(log)
  })
  .catch((err: Error) => {
    res.status(res.statusCode).send()
    console.log(err)
  })
}

/**
 * Add user to group
 * 
 * @export
 * @func add
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
export function add(req: Request, res: Response):void {
  const [creator, creatorRef] = UserHelper.getLoginedUser(req),
    candidate = req.body

  let log: any = {
    creator,
    creatorRef,
    action: CONST.USER_ACTIONS.GROUP.ADD_MEMBER,
    targetRef: CONST.ACTION_TARGETS.GROUP,
    ua: req.body.ua || req.ua
  }

  GroupModel
  .findOne({
    slug: req.params.slug
  })
  .then((group: IGroup) => {
    let self: IMember = group.members.filter(member => member.userRef === creatorRef && (<any>member.userId).equals(creator))[0],
      user: IMember = group.members.filter(member => member.userRef === candidate.ref && (<any>member.userId).equals(candidate._id))[0]

    if (!self) {
      res.status(404).send(ERRORS.GROUP.NOT_GROUP_MEMBER)
    } else if (group.settings.membership === CONST.GROUP_SETTINGS.MEMBERSHIP.MANAGED && !self.isManager) {
      res.status(404).send(ERRORS.GROUP.NOT_GROUP_MANAGER)
    } else if (user) {
      res.status(404).send(ERRORS.GROUP.ALREADY_A_MEMBER)
    } else {
      const UserModel = ModelHelper.getModelFromName(candidate.ref)

      return UserModel
      .findByIdAndUpdate(candidate._id, {$push: {"groups": group._id}})
      .then((user: IUser) => {
        group.members.push({
          userId: user._id,
          userRef: user.ref,
          alias: user.handle
        } as IMember)

        group.save()
      })
      .catch((err: NativeError) => {
        console.log(err)
        res.status(404).json({ code: ERRORS.GROUP.USER_NOT_FOUND })
        return false
      })
    }
  })
  .then(() => {
    res.status(200).json({ code: ERRORS.SUCCESS})
    new Logger(log)
  })
  .catch((err: Error) => {
    res.status(res.statusCode).send()
    console.log(err)
  })
}

/**
 * Kick user to group
 * 
 * @export
 * @func kick
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
export function kick(req: Request, res: Response):void {
  const [creator, creatorRef] = UserHelper.getLoginedUser(req),
    candidate = req.body

  let log: any = {
    creator,
    creatorRef,
    action: CONST.USER_ACTIONS.GROUP.KICK_MEMBER,
    targetRef: CONST.ACTION_TARGETS.GROUP,
    ua: req.body.ua || req.ua
  }

  GroupModel
  .findOne({
    slug: req.params.slug
  })
  .then((group: IGroup) => {
    let self: IMember = group.members.filter(member => member.userRef === creatorRef && (<any>member.userId).equals(creator))[0],
      userIndex: number = group.members.findIndex(member => member.userRef === candidate.ref && (<any>member.userId).equals(candidate._id))

    if (!self) {
      res.status(404).send(ERRORS.GROUP.NOT_GROUP_MEMBER)
    } else if (!self.isManager) {
      res.status(404).send(ERRORS.GROUP.NOT_GROUP_MANAGER)
    } else if (userIndex < 0) {
      res.status(404).send(ERRORS.GROUP.NOT_GROUP_MEMBER)
    } else if (group.members[userIndex].isManager) {
      res.status(404).send(ERRORS.GROUP.CANNOT_REMOVE_MANAGER)
    } else {
      group.members.splice(userIndex, 1)
      return group.save()
    }
  })
  .then((group: IGroup) => {
    const UserModel = ModelHelper.getModelFromName(candidate.ref)

    return UserModel
    .findByIdAndUpdate(candidate._id, {
      $pullAll: {"groups": [group._id]}
    })
    .then(() => {
      return group
    })
  })
  .then((group: IGroup) => {
    res.status(200).json({ code: ERRORS.SUCCESS })
    new Logger(log)
  })
  .catch((err: Error) => {
    res.status(res.statusCode).send()
    console.log(err)
  })
}

/**
 * Transfer manager role to another member
 * 
 * @export
 * @func transfer
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
export function transfer(req: Request, res: Response):void {
  const [creator, creatorRef] = UserHelper.getLoginedUser(req),
    candidate = req.body

  let log: any = {
    creator,
    creatorRef,
    action: CONST.USER_ACTIONS.GROUP.TRANSFER_MANAGER,
    targetRef: CONST.ACTION_TARGETS.GROUP,
    ua: req.body.ua || req.ua
  }

  GroupModel
  .findOne({
    slug: req.params.slug
  })
  .then((group: IGroup) => {
    let self: IMember = group.members.filter(member => member.userRef === creatorRef && (<any>member.userId).equals(creator))[0],
      userIndex: number = group.members.findIndex(member => member.userRef === candidate.ref && (<any>member.userId).equals(candidate._id))

    if (!self) {
      res.status(404).send(ERRORS.GROUP.NOT_GROUP_MEMBER)
    } else if (!self.isManager) {
      res.status(404).send(ERRORS.GROUP.NOT_GROUP_MANAGER)
    } else if (userIndex < 0) {
      res.status(404).send(ERRORS.GROUP.NOT_GROUP_MEMBER)
    } else {
      let selfIndex: number = group.members.findIndex(member => member.userRef === candidate.ref && (<any>member.userId).equals(creator))

      group.members[selfIndex].isManager = false
      group.members[userIndex].isManager = true

      return group.save()
    }
  })
  .then((data: IGroup) => {
    res.status(200).json(data)
    new Logger(log)
  })
  .catch((err: Error) => {
    res.status(res.statusCode).send()
    console.log(err)
  })
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
  router.get('/', setRouteVar, list)

  // single entry route
  router.get('/:slug', setRouteVar, get)

  // create route
  router.post('/', auth, setRouteVar, create)

  // update route
  router.patch('/:slug', auth, setRouteVar, update)

  // delete route
  router.delete('/:slug', auth, setRouteVar, remove)  

  // add member route
  router.patch('/:slug/add', auth, setRouteVar, add)

  // kick member route
  router.patch('/:slug/kick', auth, setRouteVar, kick)  
}