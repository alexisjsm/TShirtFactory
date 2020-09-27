import express from 'express'
import logger from 'morgan'
import cookieParse from 'cookie-parser'
import session from 'express-session'

import routerUser from './route/users'
import routerAuth from './route/auth'
import routerProduct from './route/products'

import passport from 'passport'
import jwtStrategy from './bin/strategies/jwtStrategy'
import { handleError } from './bin/ErrorHandle'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParse())

app.use(session({
  secret: process.env.KEY_SECRET_SESSION,
  resave: false,
  saveUninitialized: false
}))

/* passport configure */
passport.use('jwt', jwtStrategy)
app.use(passport.initialize())
app.use(passport.session())

/* routers */
app.use('/products', routerProduct)
app.use('/users', routerUser)
app.use('/auth', routerAuth)

/* Handle Error */
app.use((err, req, res, next) => {
  handleError(err, res, next)
})

export default app
