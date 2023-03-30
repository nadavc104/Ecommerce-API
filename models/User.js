import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const addressSchema = new mongoose.Schema({
    state: String,
    city: String,
    street: String
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        default: ['user']
    },
    address: [addressSchema],
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)

}

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const user = mongoose.model('User', userSchema)

export default user