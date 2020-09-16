import express from 'express'
import logger from 'morgan'
import cookieParse from 'cookie-parser'
import routerUser from '../src/route/users'


const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParse())

/* routers */
app.use('/users', routerUser)


export default app
