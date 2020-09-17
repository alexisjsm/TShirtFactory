import { Types } from 'mongoose'
import passport from 'passport'
import {ExtractJwt, Strategy as jwtStrategy } from 'passport-jwt'

import User from '../../Model/User'

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.KEYJWT

export default new jwtStrategy(opts, (payload, done) => {
  User.findOne({
    id: payload.sub
  }).then(user => {
    if(user === null) {
      return done(null, false)
    } else {
      return done(null,user)
    }
  })
  .catch(err => done(null,err))
})