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
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user'
  }

})

userSchema.pre('save', async function (next) {
  const salt = bcrypt.genSaltSync(10)
  const password = this.password
  this.password = await bcrypt.hashSync(password, salt)
  next()
})

const User = mongoose.model('User', userSchema)

export default User
