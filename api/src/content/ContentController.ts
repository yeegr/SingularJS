import {NextFunction, Request, RequestHandler, Response, Router} from 'express'
import {Schema, Model} from 'mongoose'
import validator from 'validator'
import fs from 'fs'
import path from 'path'
import request from 'request'
import {IncomingForm, Fields, Files} from 'formidable'

import {CONST, ERRORS, SERVERS} from '@common'
import {Logger, Err, MISC} from '@modules'
import * as ModelHelper from '@modelHelpers'
import * as UserHelper from '@users/_userHelpers'

import Media, { IMedia} from '@content/_shared/media/MediaModel'
import IUser from '@users/IUser'
import IContent from '@content/IContent'

/**
 * Initializes listing 
 * 
 * @export
 * @func list
 * @param {Request} req 
 * @param {Response} res
 * @returns {void} 
 */
export function list(req: Request, res: Response): void {
  let handle: string = MISC.getRequestParam(req, req.routeVar.userHandleKey!)

  if (handle && handle.length > 0) {
    const UserModel: Model<IUser> = ModelHelper.getModelFromName(req.routeVar.creatorType!)

    UserModel
    .findOne({handle})
    .select('_id')
    .lean()
    .then((user: IUser) => {
      if (user) {
        search(req, res, user._id)
      } else {
        res.status(404).json({ code: ERRORS.LOGIN.USER_NOT_FOUND })
      }
    })
    .catch((err: Error) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
  } else {
    search(req, res)
  }
}

/**
 * Returns listing results
 *
 * @export
 * @func search
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
const search = (req: Request, res: Response, creator?: Schema.Types.ObjectId) => {
  let params = MISC.assembleSearchParams(req, {
      status: CONST.STATUSES.CONTENT.APPROVED
    }, req.routeVar.keywordFields)

  if (creator) {
    params.query.creator = creator
  }

  const DataModel: Model<IContent> = ModelHelper.getModelFromName(req.routeVar.contentType!)

  DataModel
  .find(params.query)
  .skip(params.skip)
  .limit(params.limit)
  .sort(params.sort)
  .populate({
    path: 'creator',
    model: CONST.USER_TYPES.CONSUMER,
    select: CONST.PUBLIC_CONSUMER_INFO_LIST
  })
  .lean()
  .exec()
  .then((data: IContent[]) => {
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
  const DataModel: Model<IContent> = ModelHelper.getModelFromName(req.routeVar.contentType!)

  DataModel
  .findOneAndUpdate({
    slug: req.params.slug,
    status: CONST.STATUSES.CONTENT.APPROVED
  }, {$inc: {viewCount: 1}}, {new: true})
  .populate('creator', CONST.PUBLIC_CONSUMER_INFO)
  .populate({
    path: 'comments',
    model: 'Comment',
    limit: CONST.COMMENT_SHOWCASE_COUNT,
    options: {
      sort: {'_id': -1}
    },
    populate: {
      path: 'creator',
      model: 'Consumer',
      select: CONST.PUBLIC_CONSUMER_INFO_LIST
    }
  })
  .lean()
  .exec()
  .then((data: IContent) => {
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
 * Lists comments on item
 * 
 * @export
 * @func comments
 * @param {Request} req 
 * @param {Response} res 
 * @returns {void}
 */
export function comments(req: Request, res: Response): void {
  let slug: string = req.params.slug,
    opt: any = MISC.assembleSearchParams(req),
    match: any = {}
    
  if (req.query.hasOwnProperty('keywords') && req.query.keywords.length > 0) {
    let query: string[] = req.query.keywords.split(',')
    match = {content: {$in: query}}
  }

  const DataModel: Model<IContent> = ModelHelper.getModelFromName(req.routeVar.contentType!)

  DataModel
  .findOne({slug})
  .select(CONST.COMMENT_PARENT_FIELD_LIST)
  .populate('creator', CONST.PUBLIC_CONSUMER_INFO_LIST)
  .populate({
    path: 'comments',
    model: 'Comment',
    match,
    options: {
      sort: {'_id': -1},
      limit: opt.limit,
      skip: opt.skip
    },
    populate: {
      path: 'creator',
      model: 'Consumer',
      select: CONST.PUBLIC_CONSUMER_INFO_LIST
    }
  })
  .lean()
  .then((data: IContent) => {
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
 * Gets likes, dislikes, saves, shares and downloads of item
 * 
 * @export
 * @func sublist
 * @param {Request} req 
 * @param {Response} res 
 * @returns {void}
 */
export function sublist(req: Request, res: Response): void {
  const slug: string = req.params.slug,
    path: string = req.params.sublist,
    opt: any = MISC.assembleSearchParams(req)

  if (CONST.SUBLISTS.indexOf(path) > -1) {
    const DataModel: Model<IContent> = ModelHelper.getModelFromName(req.routeVar.contentType!)

    DataModel
    .findOne({slug})
    .select(CONST.LIKE_PARENT_FIELD_LIST)
    .populate('creator', CONST.PUBLIC_CONSUMER_INFO_LIST)
    .populate({
      path,
      model: ModelHelper.getModelNameFromPath(path),
      group: 'type',
      options: {
        sort: {'_id': -1},
        limit: opt.limit,
        skip: opt.skip
      },
      populate: {
        path: 'creator',
        model: 'Consumer',
        select: CONST.PUBLIC_CONSUMER_INFO_LIST
      }
    })
    .lean()
    .then((data: IContent) => {
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
  } else {
    res.status(404).send()
  }
}

/**
 * Check proposed slug is available to user
 *
 * @export
 * @func slug
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
export function isUnique(req: Request, res: Response): void {
  let slug: string = req.body.slug

  if (slug.length < 1) {
    res.status(422).json({ code: ERRORS.CONTENT.CONTENT_SLUG_REQUIRED })
  } else {
    const DataModel = ModelHelper.getModelFromName(req.routeVar.contentType!)

    DataModel
    .findOne({slug})
    .then((data: IContent) => {
      let isAvailable: boolean = !(data)
      res.status(200).json({isAvailable})
    })
    .catch((err: Error) => {
      res.status(res.statusCode).send()
      console.log(err)
    })
  }
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
    res.status(422).json({ code: ERRORS.CONTENT.CONTENT_CREATOR_REQUIRED })
  // check if content has title
  } else if (!title || validator.isEmpty(title)) {
    res.status(422).json({ code: ERRORS.CONTENT.CONTENT_TITLE_REQUIRED })
  } else {
    const [UserModel, DataModel] = ModelHelper.getModels(req)

    const data: IContent = new DataModel(Object.assign({}, {
        creator,
        ref: creatorRef
      }, MISC.sanitizeInput(req.routeVar.contentType, req.body)))

    let log: any = {
      creator,
      creatorRef,
      targetRef: req.routeVar.contentType,
      action: CONST.USER_ACTIONS.COMMON.CREATE,
      ua: req.body.ua || req.ua
    }

    data
    .save()
    .then((content: IContent) => {
      res.status(201).json(content)
      log.target = content._id

      return UserModel.findByIdAndUpdate(creator, MISC.getIncrement(req, 1))
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
export function update(req: Request, res: Response): void {
  const [creator, creatorRef] = UserHelper.getLoginedUser(req),
    slug: string = req.params.slug,
    title: string = req.body.title,
    body: any = MISC.sanitizeInput(req.routeVar.contentType, req.body)

  if (!creator || validator.isEmpty(creatorRef)) {
    res.status(422).json({ code: ERRORS.CONTENT.CONTENT_CREATOR_REQUIRED })
  } else if (title && validator.isEmpty(title)) {
    res.status(422).json({ code: ERRORS.CONTENT.CONTENT_TITLE_REQUIRED })
  } else if (slug && validator.isEmpty(slug)) {
    res.status(422).json({ code: ERRORS.CONTENT.CONTENT_SLUG_REQUIRED })
  } else {
    let log: any = {
      creator,
      creatorRef,
      targetRef: req.routeVar.contentType,
      action: CONST.USER_ACTIONS.COMMON.UPDATE,
      ua: req.body.ua || req.ua
    }

    const DataModel = ModelHelper.getModelFromName(req.routeVar.contentType!)

    DataModel
    .findOneAndUpdate({creator, slug}, body, {new: true})
    .then((data: IContent) => {
      if (data) {
        res.status(200).json(data)
        log.target = data._id
        return data
      }

      res.status(404).send()
      return null
    })
    .then((data: IContent) => {
      new Logger(log)
    })
    .catch((err: Error) => {
      new Err(res, err, log)
    })
  }
}

/**
 * Clears entire gallery
 * 
 * @export
 * @func clear
 * @param {Request} req 
 * @param {Response} res 
 */
export function clear(req: Request, res: Response, next: NextFunction): void {
  req.body = {
    gallery: []
  }

  next()
}

/**
 * Upload media to gallery
 * 
 * @export
 * @func upload
 * @param {Request} req 
 * @param {Response} res 
 */
export function upload(req: Request, res: Response): void {
  const [creator, creatorRef] = UserHelper.getLoginedUser(req),
    DataModel: Model<IContent> = ModelHelper.getModelFromName(req.routeVar.contentType!),
    root: string = ModelHelper.getRootFolderFromModelName(req.routeVar.contentType!),
    slug: string = req.params.slug

  DataModel
  .findOne({
    creator,
    slug
  })
  .then((data: IContent) => {
    if (data) {
      let form: IncomingForm = new IncomingForm(),
        formData: any = {
          type: CONST.IMAGE_TYPES.PHOTO,
          path: path.join(root,data._id.toString())
        },
        log: any = {
          creator,
          creatorRef,
          target: data._id,
          targetRef: req.routeVar.contentType,
          action: CONST.USER_ACTIONS.COMMON.UPLOAD,
          ua: req.body.ua || req.ua
        }
      
      form.multiples = true
    
      form
      .on('file', (fields: Fields, file: any) => {
        let fileName = MISC.renameFile(file.name),
          key = fileName.substring(0, fileName.lastIndexOf('.'))

        formData[key] = {
          value: fs.createReadStream(file.path),
          options: {
            filename: MISC.renameFile(file.name)
          }
        }
      })
      .on('end', () => {
        request
        .post({
          url: SERVERS.UPLOAD_SERVER,
          formData
        }, (err: Error, response, body) => {
          if (err) console.log(err)

          let gallery: any[] = data.gallery || [],
            fileList = JSON.parse(body).files

          fileList.forEach((m: IMedia) => {
            gallery.push(m)
          })

          DataModel
          .findByIdAndUpdate(data._id, {gallery}, {new: true})
          .then((updated: IContent) => {
            res.status(201).json(updated)
            new Logger(log)
          })
        })
      })
      .on('error', (err: Error) => {
        console.log(err)
      })

      form.parse(req)

    } else {
      res.status(404).send()
    }
  })
  .catch((err: Error) => {
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
export function remove(req: Request, res: Response): void {
  const [creator, creatorRef] = UserHelper.getLoginedUser(req),
    [UserModel, DataModel] = ModelHelper.getModels(req),
    slug: string = req.params.slug

  let log: any = {
    creator,
    creatorRef,
    action: CONST.USER_ACTIONS.COMMON.DELETE,
    targetRef: req.routeVar.contentType,
    ua: req.body.ua || req.ua
  }

  DataModel
  .findOneAndRemove({creator, slug})
  .then((data: IContent) => {
    if (data) {
      log.target = data._idtotalFollowings
      res.status(204).end()
      return data
    }

    res.status(404).send()
    return null
  })
  .then((data: IContent) => {
    return UserModel.findOneAndUpdate({
      _id: creator,
      [req.routeVar.contentCounter!]: {$gt: 0}
    }, MISC.getIncrement(req, -1))
  })
  .then((user: IUser) => {
    new Logger(log)
  })
  .catch((err: Error) => {
    new Err(res, err, log)
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

  // comment route
  router.get('/:slug/comments', setRouteVar, comments)
  
  // action list route
  router.get('/:slug/:sublist', setRouteVar, sublist)
  
  // check if slug available
  router.post('/unique', setRouteVar, isUnique)

  // create route
  router.post('/', auth, setRouteVar, create)

  // create gallery
  router.put('/:slug/gallery', auth, setRouteVar, upload)

  // clear gallery
  router.delete('/:slug/gallery', auth, setRouteVar, clear, update)

  // update route
  router.patch('/:slug', auth, setRouteVar, update)

  // delete route
  router.delete('/:slug', auth, setRouteVar, remove)  
}