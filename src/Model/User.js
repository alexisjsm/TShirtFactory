import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    enum: ['man', 'woman', 'unknown'],
    default: 'unknown'
  },
  address: {
    type: [Schema.Types.ObjectId],
    ref: 'AddressBook'
  },
  wallet: {
    type: [Schema.Types.ObjectId],
    ref: 'PaymentSystem'
  },
  order: {
    type: [Schema.Types.ObjectId],
    ref: 'Order'
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user'
  }
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    return next()
  } catch (error) {
    return next(error)
  }
})

userSchema.pre('findOneAndUpdate', async function (next) {
  if (!this._update.password) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this._update.password = await bcrypt.hash(this._update.password, salt)
    return next()
  } catch (error) {
    return next(error)
  }
})

const User = mongoose.model('User', userSchema)

export default User
