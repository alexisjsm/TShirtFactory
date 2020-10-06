import { Router } from 'express'
import passport from 'passport'
import AddressBookController from '../Controller/AddressBookController'

const route = Router()

route.post('/register/', passport.authenticate('jwt', { session: false }), AddressBookController.register)
route.put('/update/:id', passport.authenticate('jwt', { session: false }), AddressBookController.update)

export default route
