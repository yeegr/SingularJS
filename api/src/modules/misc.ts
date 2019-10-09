import { Document, Schema, NativeError, Model } from 'mongoose'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import moment from 'moment-timezone'
import randomstring from 'randomstring'

import { CONFIG, CONST, ERRORS } from '@common'

import IUser from '../users/IUser'

/**
 * Formats MongoDB native error to string
 * 
 * @export 
 * @param {Response} res 
 * @param {NativeError} err 
 * @param {string} [act=''] 
 * @param {string} [db=''] 
 * @returns {void}
 */
export function formatError(res: Response, err: NativeError, act: string = '', db: string = ''): void {
  let status: number = 500,
    message: string = '',
    code: number | null = err.hasOwnProperty('code') ? parseInt((<any>err).code, 10) : null

  if (code === 11000) {
    switch (act) {
      case CONST.USER_ACTIONS.CONSUMER.LIKE:
      case CONST.USER_ACTIONS.CONSUMER.DISLIKE:
      case CONST.USER_ACTIONS.CONSUMER.SAVE:
      case CONST.USER_ACTIONS.CONSUMER.FOLLOW:
        status = 409
        message = ERRORS.ACTION.DUPLICATED_ACTION
      break

      case CONST.USER_ACTIONS.COMMON.CREATE:
        status = 409
        message = ERRORS.LOGIN.DUPLICATED_USER_INFORMATION
      break

      default:
        message = ERRORS.UNKNOWN
      break
    }
  }

  res.status(status).json({ code, message })
  console.log(err.message)
}

/**
 * Returns an increment object for findOneAndUpdate (get)
 * 
 * @export
 * @param {Request} req 
 * @param {number} [inc=1] 
 * @returns {*} 
 */
export function getIncrement(req: Request, inc: number = 1): any {
  let $inc: any = {}
  $inc[req.routeVar.contentCounter!] = inc
  return {$inc}
}

/*******************************
 * Generic functions to retrieve 
 * values from HTTP request
 *******************************/

/**
 * Sanitize user input to ensure 
 * certain fields can only be updated via program
 * 
 * @export
 * @param {string} model 
 * @param {*} body
 * @returns {*}
 */
export function sanitizeInput(model: string | undefined, body: any): any {
  if (model) {
    let keyList: string = '_id,status,updated,totalRating,commentCount,viewCount,likeCount,dislikeCount,saveCount,shareCount,downloadCount',
      keyArray: string[] = []
    
    switch (model) {
      case CONST.ACTION_TARGETS.POST:
        keyArray = keyList.split(',')
      break
    }

    keyArray.forEach((key: string) => {
      if (body.hasOwnProperty(key)) {
        delete body[key]
      }
    })

    return body
  }
}

/**
 * Returns a santized object, by either
 * 1. keeping properties in keyList, or 
 * 2. removing properties in keyList
 * 
 * @export
 * @func sanitizeObject
 * @param {*} obj 
 * @param {string} keyList 
 * @param {boolean} [remove=false] 
 * @returns {*} 
 */
export function sanitizeObject(obj: any, keyList: string, remove: boolean = false): any {
  let keyArray: string[] = keyList.split(' '),
    tmp: any = {}

  for (let key in obj) {
    if ((!remove && keyArray.indexOf(key) > -1) || (remove && keyArray.indexOf(key) < 0)) {
      tmp[key] = obj[key]
    }
  }

  return tmp
}

/**
 * Gets value by key
 * 
 * @export
 * @param {Request} req 
 * @param {string} key 
 * @param {boolean} [isInteger = false] 
 * @param {boolean} [isNumber = false] 
 * @returns {string}
 */
export function getRequestParam(req: Request, key: string): string {
  let body = req.body,
    params = req.params,
    query = req.query,
    value = null

  value = (body && body.hasOwnProperty(key)) ? query[key] : value
  value = (params && params.hasOwnProperty(key)) ? params[key] : value
  value = (query && query.hasOwnProperty(key)) ? query[key] : value

  return (key === 'sortOn' && value === 'id') ? '_id' : value
}

/**
 * Gets query page index
 * 
 * @param {Request} req
 * @returns {number} 
 */
export function getListPageIndex(req: Request): number {
  return parseInt(getRequestParam(req, 'page'), 10) || 0
}

/**
 * Gets query item count per page
 * 
 * @param {Request} req 
 * @returns {number}
 */
export function getListCountPerPage(req: Request): number {
  return parseInt(getRequestParam(req, 'count'), 10) || CONST.DEFAULT_PAGE_COUNT
}

/**
 * Gets query sort key
 * 
 * @param {Request} req 
 * @param {string} [key = 'sortOn']
 * @returns {*} 
 */
export function getListSort(req: Request, key: string = 'sortOn'): any {
  let sort: any = {},
    prop = getRequestParam(req, key)

  if (prop && prop.length > 0) {
    sort[prop] = getListSortOrder(req)
  } else {
    // descending order by default sort order
    sort = CONST.DEFAULT_SORT_ORDER
  }

  return sort
}

/**
 * Gets query sort order
 * 
 * @param {Request} req 
 * @param {string} [key = 'orderBy'] 
 * @returns {number}
 */
export function getListSortOrder(req: Request, key: string = 'orderBy'): number {
  let order = getRequestParam(req, key),
    value = 1

  if (order && order.length > 0) {
    switch (order) {
      case '1':
      case 'asc':
      case 'asending':
        value = 1
      break

      case '-1':
      case 'desc':
      case 'desending':
        value = -1
      break
    }
  }

  return value
}

/**
 * Gets query by item list
 * 
 * @param {Request} req 
 * @param {string} field 
 * @returns {any}
 */
export function getListArray(req: Request, field: string): any {
  let query: any = {},
    key: string = getPropKey(field),
    list: string = getRequestParam(req, key).replace(/\, /g, ',')

  if (list && list.length > 0) {
    query[key] = {}
    query[key].$in = list.split(',')
  }

  return query
}

/**
 * Gets query key of item list
 * 
 * @param {string} input
 * @returns {string} 
 */
export function getPropKey(input: string): string {
  let output: string = input

  switch (input) {
    case 'in':
      output = '_id'
    break

    case 'slugs':
      output = 'slug'
    break
  }

  return output
}

/**
 * Gets query keywords
 * 
 * @export
 * @param {Request} req 
 * @param {string} fields
 * @returns {*} 
 */
export function getListKeywordQuery(req: Request, fields: string): any {
  let keywords = getRequestParam(req, 'keywords')

  if (keywords && keywords.length > 0) {
    let rx = assembleKeywordRx(keywords),
      $or: any[] = [],
      arr: string[] = fields.trim().split(',')

    arr.forEach(key => {
      let tmp: any = {}
      tmp[key.trim()] = rx
      $or.push(tmp)
    })

    return $or
  }

  return null
}

/**
 * Assembles query keyword regexp
 * 
 * @export
 * @param {string} str 
 * @param {string} [type = 'AND']
 * @returns {RegExp}
 */
export function assembleKeywordRx(str: string, type: string = 'AND'): RegExp {
  if (type === 'OR') {
    return new RegExp(str.trim().replace(/\s/g, '|').replace(/\,/g, '|'))
  } else {
    let arr = str.trim().replace(/\s/g, ',').split(','),
      rx = '^'

    arr.forEach((val: string) => {
      val = decodeURIComponent(val.trim())
      rx += '(?=.*' + val + ')'
      // rx += '(?=.*\\b' + val + '\\b)' // whole word only
    })

    rx += '.*$'

    return new RegExp(rx)
  }
}

/**
 * Assembles search parameters
 * 
 * @param {Request} req 
 * @param {any} query 
 * @param {string} [keyFields]
 * @returns {ISearchParams} 
 */
interface ISearchParams {
  query: any      // search query
  skip: number    // page index
  limit: number   // items per list page
  sort: any       // sort key and ordxer
}

export function assembleSearchParams(req: Request, query: any = {}, keyFields: string = ''): ISearchParams {
  let page: number = getListPageIndex(req),
    count: number = getListCountPerPage(req),
    sort: any = getListSort(req)

  if (this.isNotUndefinedNullEmpty(keyFields) && this.isNotUndefinedNullEmpty(getRequestParam(req, 'keywords'))) {
    query.$or = getListKeywordQuery(req, keyFields)
  }

  return {
    query,
    skip: page * count,
    limit: count,
    sort
  }
}

/*******************************
 * Miscellaneous functions 
 *******************************/

/**
 * Returns the timestamp from MongoDB ObjectId
 * 
 * @param {string} id
 * @param {boolean} [isUnix=true] 
 * @return {number} 
 */
export function getTimeFromObjectId(id: string, isUnix: boolean = true): number {
  return parseInt(id.substring(0, 8), 16) * (isUnix ? 1 : 1000)
}


/**
 * Check if any element in array 1 is also in array 2
 * 
 * @export
 * @param {any[]} arr1 
 * @param {any[]} arr2 
 * @returns {boolean} 
 */
export function matchAnyInArray(arr1: any[], arr2: any[]): boolean {
  let found = false

  for (let i = 0, j = arr1.length; i < j; i++) {
    if (arr2.indexOf(arr1[i]) > -1) {
      found = true
      break
    }
  }

  return found
}

/**
 * Check if user has roles that include roles to create content
 * 
 * @export
 * @param {IUser} user 
 * @param {string} contentType 
 * @returns {boolean} 
 */
export function checkUserCreateRight(user: IUser, contentType: string): boolean {
  const userRoles = user.roles,
    creatorRoles = CONST.CONTENT_CREATOR_ROLES[contentType.toUpperCase()]

  return matchAnyInArray(userRoles, creatorRoles)
}


/**
 * Normalizes file name
 * 
 * @export
 * @param {string} fileName 
 * @returns {string} 
 */
export function normalizeFilename(fileName: string): string {
  let tmpName = fileName.replace(/\.jpeg$/, '.jpg')
  return tmpName
}

/**
 * Renames file with random string
 * 
 * @export
 * @param {string} fileName 
 * @returns {string} 
 */
export function renameFile(fileName: string): string {
  let tmpName = normalizeFilename(fileName),
    ext = tmpName.substring(tmpName.lastIndexOf('.')),
    str = randomstring.generate({
      length: CONFIG.UPLOAD_FILENAME_LENGTH,
      charset: CONFIG.UPLOAD_FILENAME_CHARSET,
      capitalization: 'lowercase'
    })

  return str + ext
}
