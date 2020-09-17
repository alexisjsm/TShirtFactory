import express from 'express'
import UserController from '../Controller/UserController'
import router from './users'

const route = express.Router()

route.post('/login', UserController.login)
router.post('/logout', UserController.logout)


export default route