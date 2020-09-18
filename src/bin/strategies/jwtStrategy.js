import { use } from 'passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import User from '../../Model/User'

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.KEY_SECRET_JWT

export default new JwtStrategy(opts, (payload, done) => {
  const id = payload.sub
  User.findById(id).then(user => {
    if (user === null) {
      return done(null, false)
    } else {
      return done(null, user)
    }
  })
    .catch(err => done(null, err))
})
