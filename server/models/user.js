const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
        unique: true
    },
    name: {
        type: String,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
        unique: true
    },
    images: {
        type: Array,
        default: [
        {
            url: 'https://via.placeholder.com/200x200.png?text=Profile',
            public_id: Date.now
        }
    ]
    },
    about: {
        type: String,
        trim: true
    }
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)