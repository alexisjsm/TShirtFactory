import User from '../Model/User'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'

const options = {
  new: true,
  runValidators: true
}

const UserController = {
  register: async (req, res) => {
    try {
      const { email } = req.body
      await User.findOne({ email: { $eq: email } }).then(async email => {
        if (email) {
          res.status(409).json({ message: 'This user exists' })
        } else {
          await User.create(req.body).then(user => {
            res.status(202).json({ message: `User created ${user.id}` })
          })
        }
      })
    } catch (error) {
      res.status(202).json(error)
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params
      const { role, ...data } = req.body // exclude role
      await User.findOneAndUpdate({
        _id: id
      }, data, options).select('-role -password').then(user => {
        if (user) {
          res.status(202).json({ message: 'We have updated user', user })
        } else {
          res.status(404).json({ message: 'Not found User' })
        }
      })
        .catch(error => {
          switch (error.code) {
            case 11000:
              res.status(409).json({ message: 'Email already is duplicate in database' })
              break
          }
        })
    } catch (error) {
      res.status(500).json({ message: 'We have a been a problem' + error })
    }
  },
  updateRol: async (req, res) => {
    const { id } = req.params
    const { role } = req.body

    try {
      await User.findOneAndUpdate({
        _id: id
      }, { role: role },
      options
      ).then(user => {
        if (user) {
          res.status(200).json({ message: `$the user email ${user.email} change to role ${user.role}` })
        } else {
          res.status(404).json({ message: 'Not found user' })
        }
      })
        .catch(() => {
          res.status(409).json({ message: 'This value has not been allowed' })
        })
    } catch (error) {
      res.status(500).json({ message: 'We have a problem' + error })
    }
  },
  remove: async (req, res) => {
    try {
      const { id } = req.params

      await User.findByIdAndRemove({ _id: id }).then(user => {
        if (user) {
          res.status(200).json({ message: 'User was removed' })
        } else {
          res.status(404).json({ message: 'Not found user' })
        }
      })
    } catch (error) {
      res.status(500).json({ message: 'We have a problem' })
    }
  },
  findUserById: async (req, res) => {
    const { id } = req.user
    try {
      await User.findById(id).select('-password').then(user => {
        if (user) {
          res.status(202).json(user)
        } else {
          res.status(404).json({ message: 'Not found user' })
        }
      })
    } catch (error) {
      res.status(500).json({ message: 'We have a problem' + error })
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body
    await User.findOne({
      email: {
        $eq: email
      }
    }).then(user => {
      if (user === null || !bcrypt.compareSync(password, user.password)) {
        res.status(404).json({ message: 'User or password incorrect' })
      } else {
        const payload = {}
        payload.sub = user.id
        payload.role = user.role

        const refreshToken = jsonwebtoken.sign(payload, process.env.KEY_SECRET_JWT, { expiresIn: '1d' })
        res.status(202).json({ refresh_token: `Bearer ${refreshToken}` })
      }
    })
  },
  logout: async (req, res) => {
    // TODO: logout

  }
}

export default UserController
