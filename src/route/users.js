import UserController from '../Controller/UserController'
import express from 'express'
import passport from 'passport'

const router = express.Router()

router.post('/register', UserController.register)
router.put('/change/:id', UserController.update)
router.put('/change/role/:id', UserController.updateRol)
router.delete('/delete/:id', UserController.remove)

router.get('/profile',passport.authenticate('jwt', {session: false}),UserController.findUserById)

export default router