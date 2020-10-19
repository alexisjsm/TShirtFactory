import { ErrorHandle } from '../bin/ErrorHandle'
import AddressBook from '../Model/Addressbook'
import User from '../Model/User'

const AddressBookController = {
  register: async (req, res, next) => {
    const { id } = req.user
    const {
      name,
      lastname,
      country,
      location,
      state,
      postcode,
      telephone,
      mobile,
      isDefault
    } = req.body
    const data = {
      name,
      lastname,
      country,
      location,
      state,
      postcode,
      telephone,
      mobile,
      isDefault,
      userId: id
    }
    try {
      if (isDefault) {
        await AddressBook.find({
          userId: id,
          isDefault: { $eq: isDefault }
        }).then((address) => {
          if (address.length)
            throw new ErrorHandle(409, 'This address can not be default')
        })
      }
      const address = await AddressBook.create(data)
        .then((address) => {
          if (!address) throw new ErrorHandle(409, 'Something is wrong')
          return address
        })
        .catch((error) => {
          throw new ErrorHandle(409, error)
        })
      const user = await User.findByIdAndUpdate(
        { _id: id },
        {
          $push: {
            address: address.id
          }
        }
      ).then((user) => {
        if (!user) throw new ErrorHandle(404, 'Not found user')
        return user
      })
      if (user && address)
        res.status(200).json({ message: 'Address add', address })
    } catch (error) {
      next(error)
    }
  },
  update: async (req, res, next) => {
    const { id } = req.params
    const { id: userId } = req.user
    const {
      name,
      lastname,
      country,
      location,
      state,
      postcode,
      telephone,
      mobile,
      isDefault
    } = req.body
    const data = {
      name,
      lastname,
      country,
      location,
      state,
      postcode,
      telephone,
      mobile,
      isDefault
    }
    try {
      await AddressBook.find({
        userId: userId,
        isDefault: { $eq: isDefault }
      }).then((address) => {
        if (address.length)
          throw new ErrorHandle(409, 'This address can not be default')
      })

      const address = await AddressBook.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
        omitUndefined: true
      })
        .then((address) => {
          if (!address) throw new ErrorHandle(404, 'Not found address')
          return address
        })
        .catch((error) => {
          if (error.statusCode) next(error)
          throw new ErrorHandle(400, error)
        })
      if (address) res.status(200).json({ message: 'Updated address', address })
    } catch (error) {
      next(error)
    }
  },
  remove: async (req, res, next) => {
    const { id } = req.params
    const { id: userId } = req.user

    try {
      const address = await AddressBook.findByIdAndRemove(id).then(
        (address) => {
          if (!address) throw new ErrorHandle(404, 'Not found address')
          return address
        }
      )
      const user = await User.findOneAndUpdate(
        { _id: userId, address: { $in: id } },
        { $pull: { address: { $in: id } } }
      ).then((user) => {
        if (!user) throw new ErrorHandle(404, 'Not found address on user')
        return user
      })
      if (user && address) res.status(200).json({ message: 'Remove address' })
    } catch (error) {
      next(error)
    }
  },
  getAddress: async (req, res, next) => {
    const { id: userId } = req.user
    try {
      await AddressBook.findOne({ userId })
        .lean()
        .then((addresses) => {
          if (!addresses) throw new ErrorHandle(404, 'Not found address')
          res.status(200).json({ message: 'All addresses', addresses })
        })
    } catch (error) {
      next(error)
    }
  }
}

export default AddressBookController
