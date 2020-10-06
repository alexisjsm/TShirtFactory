import { ErrorHandle } from '../bin/ErrorHandle'
import AddressBook from '../Model/Addressbook'
import User from '../Model/User'
const AddressBookController = {
  register: async (req, res, next) => {
    const { id } = req.user
    const { name, lastname, country, location, state, postcode, telephone, mobile, isDefault } = req.body
    const data = { name, lastname, country, location, state, postcode, telephone, mobile, isDefault, userId: id }
    try {
      if (isDefault) {
        await AddressBook.find({ userId: id, isDefault: { $eq: isDefault } })
          .then(address => {
            console.log(address)
            if (address.length) throw new ErrorHandle(409, 'This address can not be default')
          })
      }
      const address = await AddressBook.create(data)
        .then(address => {
          if (!address) throw new ErrorHandle(409, 'Something is wrong')
          return address
        })
        .catch(error => error)
      const user = await User.updateOne({ _id: id }, {
        $push: {
          address: address.id
        }
      }).then(user => {
        if (!user) throw new ErrorHandle(404, 'Not found user')
        return user
      })
      if (user && address) res.status(200).json({ message: 'Address add', address })
    } catch (error) {
      next(error)
    }
  },
  update: async (req, res, next) => {
    const { id } = req.params
    const { id: userId } = req.user
    const { name, lastname, country, location, state, postcode, telephone, mobile, isDefault } = req.body
    const data = { name, lastname, country, location, state, postcode, telephone, mobile, isDefault }
    console.log(data)
    try {
      await AddressBook.find({ userId: userId, isDefault: { $eq: isDefault } })
        .then(address => {
          if (address.length) throw new ErrorHandle(409, 'This address can not be default')
        })
        .catch(error => error)
      await AddressBook.findByIdAndUpdate(id, data, { new: true, runValidators: true, omitUndefined: true })
        .then(address => {
          if (!address) throw new ErrorHandle(404, 'Not found address')
          res.status(200).json({ message: 'Updated address', address })
        })
        .catch(error => error)
    } catch (error) {
      next(error)
    }
  }
}

export default AddressBookController
