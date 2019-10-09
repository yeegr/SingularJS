import { NativeError, Model } from 'mongoose'
import { Request, Response } from 'express'

import { CONST, UTIL } from '@common'

import IUser from '@users/IUser'
import IContent from '@content/IContent'

import Consumer from '@users/consumer/ConsumerModel'
import Platform from '@users/platform/PlatformModel'

import Post from '@content/post/PostModel'
import Event from '@content/event/EventModel'

import Comment from '@actions/comment/CommentModel'
import Like from '@actions/like/LikeModel'
import Dislike from '@actions/dislike/DislikeModel'
import Save from '@actions/save/SaveModel'
import Follow from '@actions/follow/FollowModel'
import Share from '@actions/share/ShareModel'
import Download from '@actions/download/DownloadModel'

/**
 * Gets data model from action
 * 
 * @export
 * @param {string} action
 * @returns {any}
 */
export function getModelFromAction(action: string): any {
  let model: any = null

  switch (action.toUpperCase()) {
    case CONST.USER_ACTIONS.CONSUMER.LIKE:
    case CONST.USER_ACTIONS.CONSUMER.UNDO_LIKE:
      model = Like
    break

    case CONST.USER_ACTIONS.CONSUMER.DISLIKE:
    case CONST.USER_ACTIONS.CONSUMER.UNDO_DISLIKE:
      model = Dislike
    break

    case CONST.USER_ACTIONS.CONSUMER.SAVE:
    case CONST.USER_ACTIONS.CONSUMER.UNDO_SAVE:
      model = Save
    break

    case CONST.USER_ACTIONS.CONSUMER.FOLLOW:
    case CONST.USER_ACTIONS.CONSUMER.UNFOLLOW:
      model = Follow
    break

    case CONST.USER_ACTIONS.CONSUMER.SHARE:
      model = Share
    break

    case CONST.USER_ACTIONS.CONSUMER.DOWNLOAD:
      model = Download
    break
  }

  return model
}


/**
 * Gets data model from model name
 * 
 * @exports
 * @param {string} key 
 * @returns {Model<any> | null}
 */
export function getModelFromName(key: string): Model<any> {
  let modelName = UTIL.capitalizeFirstLetter(key),
    dataModel: Model<any> = Model

  switch (modelName) {
    case CONST.USER_TYPES.CONSUMER:
      dataModel = Consumer
    break

    case CONST.USER_TYPES.PLATFORM:
      dataModel = Platform
    break

    case CONST.ACTION_TARGETS.POST:
      dataModel = Post
    break

    case CONST.ACTION_TARGETS.EVENT:
      dataModel = Event
    break

    case 'signup':
      // dataModel = Signup
    break

    case 'order':
      // dataModel = Order
    break

    case CONST.ACTION_TARGETS.COMMENT:
      dataModel = Comment
    break
  }

  return dataModel
}

/**
 * Gets data model name from object key
 * 
 * @export
 * @param {string} path
 * @returns {string|any}
 */
export function getModelNameFromPath(path: string): string|any {
  let key = path.toLowerCase(),
    model = ''

  switch (key) {
    case 'posts':
      model = 'Post'
    break

    case 'events':
      model = 'Event'
    break

    case 'signups':
      model = 'Signup'
    break

    case 'orders':
      model = 'Order'
    break

    case 'comments':
      model = 'Comment'
    break
  }

  return model
}

/**
 * Gets asset root folder name from data model
 * 
 * @export
 * @param {string} name 
 * @returns {string} 
 */
export function getRootFolderFromModelName(name: string): string {
  let root = ''

  switch (name) {
    case CONST.USER_TYPES.CONSUMER:
      root = 'consumers'
    break

    case CONST.USER_TYPES.PROVIDER:
      root = 'providers'
    break

    case CONST.USER_TYPES.PLATFORM:
      root = 'platforms'
    break

    case CONST.ACTION_TARGETS.POST:
      root = 'posts'
    break

    case CONST.ACTION_TARGETS.EVENT:
      root = 'events'
    break

    case CONST.ACTION_TARGETS.PRODUCT:
      root = 'products'
    break

  }

  return root
}


/**
 * Returns creator and content data model
 * 
 * @export
 * @param {Request} req
 * @returns {[Model<IUser>, Model<IContent>]}
 */
export function getModels(req: Request): [Model<IUser>, Model<IContent>] {
  const UserModel = this.getModelFromName(req.routeVar.creatorType),
    DataModel = this.getModelFromName(req.routeVar.contentType)
  return [UserModel, DataModel]
}


/***********************************
 * Universal functions for comments
 ***********************************/

/**
 * Adds a comment to the document comment list
 * 
 * @export
 * @param {any} doc 
 * @param {Schema.Types.ObjectId} id 
 * @param {number} rating 
 * @returns {void} 
 */
export function addComment(doc: any, rating?: number): void {
  if (rating && !isNaN(rating)) {
    doc.totalRating += rating
    doc.commentCount++
    doc.save()
  }
}

/**
 * Updates total rating when a comment is updated 
 * 
 * @export
 * @param {any} doc 
 * @param {number} diff 
 * @returns {void}
 */
export function updateComment(doc: any, diff?: number): void {
  if (diff && !isNaN(diff) && diff !== 0) {
    doc.totalRating += diff
    doc.save()
  }
}

/**
 * Removes a comment to the document comment list
 * 
 * @export
 * @param {any} doc 
 * @param {Schema.Types.ObjectId} id 
 * @param {number} rating 
 * @returns {void} 
 */
export function removeComment(doc: any, rating?: number): void {
  if (rating && !isNaN(rating)) {
    doc.totalRating -= rating
    doc.commentCount--
    doc.save()
  }
}

/**
 * Returns average rating from comments
 * 
 * @param {IContent} doc 
 */
export function getAverageRating(doc: IContent): number | null {
  return (doc.commentCount > 0) ? Math.round(doc.totalRating / doc.commentCount * 2) / 2 : null
}

/**
 * Set updated timestamp
 * 
 * @export
 * @param {IUser|IContent} doc 
 * @param {string[]]} keys 
 */
export function setUpdateTime(doc: IUser|IContent, keys: string[]): void {
  let toUpdate = false

  keys.map((key: string) => {
    toUpdate = (doc.getUpdate()[key]) ? true : toUpdate
  })

  if (toUpdate) {
    doc.updated = UTIL.getTimestamp()
  }
}

/**
 * Gets list of keys to be populated from path
 * 
 * @export
 * @param {string} path
 * @returns {string}
 */
export function getSelectFieldsFromPath(path: string): string {
  let key = getModelNameFromPath(path),
    select = ''

  switch (key) {
    case 'posts':
    case 'events':
      select = 'slug title excerpt commentCount totalRatings averageRating'
    break
  }

  return select
}