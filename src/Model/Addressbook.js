import mongoose, { Schema } from 'mongoose'

const AddressBookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  postcode: {
    type: String,
    required: true,
    maxlength: 5,
    validate: {
      validator: function (v) {
        return /\d{5}/.test(v)
      }
    }
  },
  telephone: {
    type: String,
    maxlength: 9,
    validate: {
      validator: function (v) {
        return /\d{9}/.test(v)
      }
    }
  },
  mobile: {
    type: String,
    maxlength: 9,
    validate: {
      validator: function (v) {
        return /\d{9}/.test(v)
      }
    }
  },
  isDefault: {
    type: Boolean,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

const AddressBook = mongoose.model('AdressBook', AddressBookSchema)

export default AddressBook
