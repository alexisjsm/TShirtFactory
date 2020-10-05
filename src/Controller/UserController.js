import User from '../Model/User'
import { ErrorHandle } from '../bin/ErrorHandle'

const options = {
  new: true,
  runValidators: true
}

const UserController = {
  register: async (req, res, next) => {
    const { email } = req.body
    try {
      await User.findOne({ email: email })
        .then(user => {
          if (user) throw new ErrorHandle(409, 'This user exists')
        })
      await User.create(req.body)
        .then(user => {
          res.status(200).json({ message: 'User created' })
        })
    } catch (error) {
      next(error)
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params
      const { role, ...data } = req.body // exclude role
      await User.findOneAndUpdate({
        _id: id
      }, data, options).select('-role -password').then(user => {
        if (!user) throw new ErrorHandle(404, 'Not found user')

        res.status(200).json({ message: 'User updated', user })
      })
        .catch(error => {
          if (error.code) next(error)
          throw new ErrorHandle(409, error.message)
        })
    } catch (error) {
      next(error)
    }
  },
  updateRol: async (req, res, next) => {
    const { id } = req.params
    const { role } = req.body
    const userRole = req.user.role
    try {
      if (userRole === 'user') throw new ErrorHandle(401, "You don't have access")
      await User.findOneAndUpdate({
        _id: id
      }, { role: role },
      options
      ).then(user => {
        if (!user) throw new ErrorHandle(404, 'Not found user')

        res.status(200).json({ message: `the user email ${user.email} change to role ${user.role}` })
      })
    } catch (error) {
      next(error)
    }
  },
  remove: async (req, res, next) => {
    const { id } = req.params
    const { role } = req.user

    try {
      if (role === 'user' || role === 'seller') throw new ErrorHandle(401, "You don't have access")
      await User.findByIdAndDelete(id)
        .then(user => {
          if (!user) throw new ErrorHandle(404, 'Not found user')
          res.status(200).json({ message: 'Deleted user' })
        })
    } catch (error) {
      next(error)
    }
  },
  findUserById: async (req, res, next) => {
    const { id } = req.user
    try {
      await User.findById(id).select('-password').then(user => {
        if (!user) {
          throw new ErrorHandle(404, 'Not found user')
        }
        res.status(200).json({ message: 'Profile', user })
      })
    } catch (error) {
      next(error)
    }
  }
}

export default UserController
