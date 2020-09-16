import UserController from '../Controller/UserController'
import express from 'express'

const router = express.Router()

router.post('/register', UserController.register)
router.put('/change/:id', UserController.update)
router.put('/change/role/:id', UserController.updateRol)


export default router