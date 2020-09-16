import User from '../Model/User'

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
            res.status(202).json(user)
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
      const {role, ...data} = req.body // exclude role
      
      await User.findOneAndUpdate({
        _id: id
      }, data, options).then(user => {
        if(user){
          res.status(200).json({message: 'We have updated users'})
        } else{
          res.status(404).json({message: 'Not found User'})
        }
      })
      .catch(error => {
        switch(error.codeName) {
          case 'DuplicateKey':
          res.status(409).json({message: 'Email already is exists in database'})
          break
        }
      })
    } catch (error) {
      res.status(500).json({message: 'We have a been a problem' + error})
    }
  },
  updateRol: async (req, res) =>{
    const { id } = req.params
    const { role } = req.body

    try {
      await User.findOneAndUpdate({
        _id: id
      }, {role: role},
      options
      ).then(user => {
        if (user) {
          res.status(200).json({message: `$the user email ${user.email} change to role ${user.role}`})
        } else {
          res.status(404).json({message: 'Not found user'})
        }
      })
      .catch(error =>{
        res.status(409).json({message: 'This value has not been allowed'})
      })
    } catch (error) {
      res.status(500).json({message: 'We have a problem' + error})
    }
  },
  remove: async (req, res) => {
    try {
      
      const {id} = req.params

      await User.findByIdAndRemove({_id: id}).then(user => {
        if (user) {
          res.status(200).json({message: 'User was removed'})
        } else {
          res.status(404).json({message: 'Not found user'})
        }
      })

    } catch (error) {
      res.status(500).json({message: 'We have a problem'})
    }
  }
}

export default UserController
