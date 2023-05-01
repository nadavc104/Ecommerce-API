import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default: null
        },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        }
    ],
    path: {
        type: String,
        required: true,
        unique: true,
        default: ''
    }
}, {
    timestamps: true
})

const category = mongoose.model('Category', categorySchema)

export default category