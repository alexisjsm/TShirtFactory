import { ErrorHandle } from '../bin/ErrorHandle'
import Wallet from '../Model/Wallet'
import User from '../Model/User'

const WalletController = {
  register: async (req, res, next) => {
    const { id: userId } = req.user
    const { type, title, valid, cardNumber } = req.body
    const creditCard = { type, title, valid, cardNumber }
    try {
      const wallet = await Wallet.create({ userId, creditCard })
        .then((wallet) => wallet)
        .catch((error) => {
          throw new ErrorHandle(400, error)
        })
      const user = await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            wallet: wallet.id
          }
        },
        { new: true, runValidators: true }
      )
        .then((user) => {
          if (!user) throw new ErrorHandle(404, 'Not found user')
          return user
        })
        .catch((error) => {
          if (error.statusCode) next(error)
          throw new ErrorHandle(400, error)
        })
      if (user && wallet)
        res.status(200).json({ message: 'creditCard add', wallet })
    } catch (error) {
      next(error)
    }
  },
  update: async (req, res, next) => {
    const { id } = req.params
    const { id: userId } = req.params
    const { type, title, valid, cardNumber, balance } = req.body
    const creditcard = { type, title, valid, cardNumber, balance }

    try {
      const user = await User.find({ _id: userId, wallet: { $in: id } }).then(
        (user) => {
          if (!user) throw new ErrorHandle(404, 'Not found User')
          return user
        }
      )
      const wallet = await Wallet.findOneAndUpdate({ _id: id }, creditcard, {
        new: true,
        runValidators: true,
        omitUndefined: true
      })
        .lean()
        .then((creditcard) => {
          if (!creditcard) throw new ErrorHandle(404, 'Not found credit card')
          return creditcard
        })
        .catch((error) => {
          if (error.statusCode) next(error)
          throw new ErrorHandle(400, error)
        })
      if (user && wallet)
        res.status(200).json({ message: 'updated credit card', creditcard })
    } catch (error) {
      next(error)
    }
  },

  wallet: async (req, res, next) => {
    const { id: userId } = req.user
    try {
      await Wallet.find({ userId: userId }).then((wallet) => {
        if (!wallet)
          throw new ErrorHandle(404, 'Not found credit cards on wallet')
        res.status(200).json({ message: 'Wallet', wallet })
      })
    } catch (error) {
      next(error)
    }
  },

  remove: async (req, res, next) => {
    const { id } = req.params
    const { id: userId } = req.user
    try {
      const wallet = await Wallet.findByIdAndRemove(id).then((creditcard) => {
        if (!creditcard) throw new ErrorHandle(404, 'Not found credit card')
        return creditcard
      })
      const user = await User.findOneAndUpdate(
        { _id: userId, wallet: { $in: id } },
        { $pull: { wallet: id } }
      ).then((user) => {
        if (!user) throw new ErrorHandle(404, 'Not found credit card on wallet')
        return user
      })
      if (wallet && user)
        res.status(200).json({ message: 'Removed credit card' })
    } catch (error) {
      next(error)
    }
  }
}

export default WalletController
