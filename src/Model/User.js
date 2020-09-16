import mongoose from 'mongoose'

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
        required: true
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

const User = mongoose.model('User', userShema)

export default User
