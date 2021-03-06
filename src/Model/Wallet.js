import mongoose, { Schema } from 'mongoose'

const WalletSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  creditCard: {
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
      default: 'credit'
    },
    title: {
      type: String,
      maxlength: 28,
      required: true
    },

    cardNumber: {
      type: String,
      minlength: 19,
      maxlength: 19,
      validate: {
        validator: function (v) {
          return /^[\d ]{19}$/.test(v)
        }
      },
      required: true
    },
    valid: {
      month: {
        type: Number,
        min: 1,
        max: 12
      },
      year: {
        type: Number,
        min: 0,
        max: 999
      }
    },
    balance: {
      type: Schema.Types.Decimal128,
      default: 0,
      required: true
    },
    isSelect: {
      type: Boolean,
      required: true,
      default: false
    }
  }
})

const Wallet = mongoose.model('Wallet', WalletSchema)

export default Wallet
