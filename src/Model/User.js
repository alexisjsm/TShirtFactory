import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userShema = new mongoose.Schema({
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
        minlength: 6,
        maxlength: 8,
        required: true,
    },
    genre: {
        type: String,
        enum: ['man', 'woman', 'unknown'],
        default: 'unknown',
    },
    role: {
        type: String,
        enum: ['user', 'seller', 'admin'],
        default: 'user'
    }

})

userShema.pre('save', async function (next) {
    const salt = bcrypt.genSaltSync(10)
    const password = this.password
    this.password = await bcrypt.hashSync(password, salt)
    next()
})



const User = mongoose.model('User', userShema)


export default User
