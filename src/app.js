import express from 'express'
import logger from 'morgan'
import cookieParse from 'cookie-parser'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParse())

export default app
