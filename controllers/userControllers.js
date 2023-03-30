import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

//lean - give us json like document without schema methods.
//locale - check for language
//strength - check case senstivity
//exec - to receive promise back
//collation - to add rules such as lowercase and language

// @desc Create user
// @route POST /users
// @access Private

const createUser = asyncHandler(async (req, res) => {

    const { username, password, email, firstName, lastName, roles } = req.body

    //locale - check for language , strength - check case senstivity
    const duplicate = await User.findOne({ $or: [{username}, {email}]}).collation({locale: 'en', strength: 2 }).lean().exec()

    if(duplicate?.username === username)
        return res.status(409).json({ message: 'user already exists' })

    if(duplicate?.email === email)
        return res.status(409).json({ message: 'email already exists' })

    const userObject = (!Array.isArray(roles) || !roles.length) ? 
    {username, password, email, firstName, lastName} 
    : {username, password, email, firstName, lastName, roles}

    const user = await User.create(userObject)

    if(user) {
        res.status(201).json({ message: `New user ${username} was created` })
    } else {
        res.status(400).json({ message: 'Invalid user data' })
    }
})

// @desc Get all users
// @route GET /users
// @access Private

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if(!users?.length)
        return res.status(400).json({ message: 'No users found' })
    
    res.json(users)
})

// @desc Get single user
// @route GET /users/:id
// @access Private

const getUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const user = await User.findById(id).select('-password').lean()
    
    if(!user)
        return res.status(400).json({ message: 'User not found' })

    res.json(user)
})

// @desc Update user
// @route PATCH /users/:id
// @access Private

const updateUser = asyncHandler(async (req, res) => {

    const { id } = req.params
    const { roles, active } = req.body
    
    const user = await User.findById(id).exec()
    console.log(user)
    if(!user)
        return res.status(400).json({ message: 'User not found' })
   
    if(JSON.stringify(user.roles) === JSON.stringify(roles) && user.active === active)
        return res.status(400).json({ message: 'Change the fields to update the user' })

    user.roles = roles
    user.active = active
    const updatedUser = await user.save()

    res.status(200).json({ message: `Username: ${updatedUser.username} updated successfully` })
})

// @desc Delete user
// @route DELETE /users/:id
// @access Private

const deleteUser = asyncHandler(async (req, res) => {

    const { id } = req.params
    
    const user = await User.findById(id).exec()

    if(!user)
        return res.status(400).json({ message: 'User not found' })
    
    const deletedUser = await user.deleteOne()

    res.status(200).json({ message: `${deletedUser.username} was deleted successfully` })
})

export { createUser, getUsers, getUser, deleteUser, updateUser }