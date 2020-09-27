import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import { ErrorHandle } from '../bin/ErrorHandle'
import User from '../Model/User'

const AuthController = {
  login: async (req, res, next) => {
    const { email, password } = req.body
    try {
      await User.findOne({
        email: email
      }).then(user => {
        if (user === null || !bcrypt.compareSync(password, user.password)) throw new ErrorHandle(409, 'User or password incorrect')
        const payload = {}
        payload.sub = user.id
        payload.role = user.role

        const refreshToken = jsonwebtoken.sign(payload, process.env.KEY_SECRET_JWT, { expiresIn: '1d' })
        res.status(200).json({
          message: 'Login Success',
          refresh_token: `Bearer ${refreshToken}`
        })
      })
    } catch (error) {
      next(error)
    }
  },
  logout: async (req, res) => {
    // TODO: logout

  }
}

export default AuthController
