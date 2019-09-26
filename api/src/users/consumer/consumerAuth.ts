import passport, { Strategy } from 'passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as OAuth2Strategy } from 'passport-oauth2'
import { Strategy as WeChatStrategy } from 'passport-wechat'
import validator from 'validator'

import { CONFIG, CONST, ERRORS } from '@common'

import Consumer, { IConsumer } from './ConsumerModel'

passport.use('consumerJwt', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: CONFIG.JWT_SECRETS.CONSUMER
  }, (payload: any, done: Function) => {
    Consumer
    .findOne({
      _id: payload.sub,
      status: CONST.STATUSES.CONSUMER.ACTIVE
    })
    .then((user: IConsumer) => {
      if (user) {
        return done(null, user, 'jwt')
      } else {
        return done(null, false)
      }
    })
    .catch((err: Error) => {
      return done(err, false)
    })
  }) as Strategy
)

passport.use('consumerLocal', new LocalStrategy({
    usernameField: 'username'
  }, (username: string, password: string, done: Function) => {
    Consumer
    .findOne({
      username,
      status: CONST.STATUSES.CONSUMER.ACTIVE
    })
    .then((user: IConsumer) => {
      if (user) {
        user.comparePassword(password, (err: Error, isMatch: boolean) => {
          if (err) { return done(err) }
          if (!isMatch) { return done(null, false, { code: ERRORS.LOGIN.PASSWORD_INCORRECT })}
          return done(null, user, 'local')
        })
      } else {
        return done(null, false, { code: ERRORS.LOGIN.USER_NOT_FOUND })
      }
    })
    .catch((err: Error) => {
      return done(err, false)
    })
  }) as Strategy
)
