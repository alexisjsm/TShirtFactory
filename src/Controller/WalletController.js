import { ErrorHandle } from '../bin/ErrorHandle'
import PaymentSystem from '../Model/Wallet'
import User from '../Model/User'

const WalletController = {
  register: async (req, res, next) => {
    const { id: userId } = req.user
    const { type, title, valid, balance } = req.body
    const creditcard = { type, title, valid, balance }
    try {
      const wallet = await PaymentSystem.create({ userId, creditcard })
        .then(wallet => wallet)
        .catch(error => { throw new ErrorHandle(400, error) })
      const user = await User.findOneAndUpdate({ _id: userId }, {
        $push: {
          wallet: wallet.id
        }
      }, { new: true, runValidators: true }).then(user => {
        if (!user) throw new ErrorHandle(404, 'Not found user')
        return user
      })
        .catch(error => { throw new ErrorHandle(400, error) })
      if (user && wallet) res.status(200).json({ message: 'creditcard add', wallet })
    } catch (error) {
      next(error)
    }
  },
  update: async (req, res, next) => {
    const { id } = req.params
    const {id: userId} = req.params
    const { type, title, valid, balance} = req.body
    const creditcard = {type, title, valid, balance }

    try {
      const user = await User.find({_id: userId, wallet:{$in: id}})
      .then(user => {
        if (!user) throw new ErrorHandle(404, 'Not found User')
        return user
      })
      const wallet = await PaymentSystem.findOneAndUpdate({_id: id}, creditcard, {new: true, runValidators: true, omitUndefined: true})
      .lean()
      .then(creditcard => {
        if (!creditcard) throw new ErrorHandle(404, 'Not found credit card')
        return creditcard 
      })
      if (user && wallet) res.status(200).json({message: 'updated credit card', creditcard})
    } catch (error) {
      next(error)
    }
  },
  remove: async (req, res, next) => {
    const { id } = req.params
    const {id: userId} = req.user
    try {
      const wallet =  await PaymentSystem.findByIdAndRemove(id).then(creditcard => {
        if (!creditcard) throw new ErrorHandle(404, 'Not found credit card')
        return creditcard
      })
    const user = await User.findOneAndUpdate({_id: userId, wallet:{$in: id }}, {$pull: {wallet: id }})
      .then(user => {
        if (!user) throw new ErrorHandle(404, 'Not found credit card on wallet')
        return user 
      })
      if (wallet && user) res.status(200).json({message: 'Removed credit card'})
    } catch (error) {
      next(error)
    }
  }
}

export default WalletController
