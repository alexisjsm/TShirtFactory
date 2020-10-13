import { Router } from 'express'
import passport from 'passport'
import walletController from '../Controller/WalletController'
const route = Router()

route.get('/', passport.authenticate('jwt', {session: false }), walletController.wallet)

route.post('/register', passport.authenticate('jwt', {session: false }), walletController.register)

route.put('/update/:id', passport.authenticate('jwt', {session: false}), walletController.update)

route.delete('/remove/:id', passport.authenticate('jwt', {session: false}), walletController.remove)

export default route
