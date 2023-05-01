import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import asyncHandler from 'express-async-handler';

const verifyJWT = asyncHandler(async (req, res, next) => {
    console.log('verifyJWT middleware')
    const authHeader = req.headers.authorization || req.headers.Authorization

    if(!authHeader?.startsWith('Bearer'))
        return res.status(401).json({ message: 'Unauthorized' })

    const token = authHeader.split(' ')[1]
    console.log(token)
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err)
                return res.status(403).json({ message: 'Forbidden'})
                console.log(decoded)

            req.user = decoded.userInfo.username
            req.roles = decoded.userInfo.roles
            
            next()
        }
    )
})

const admin = (req, res, next) => {
    console.log('admin middleware')

    if(req.user && req.roles?.includes('admin')) {
        next()
    } else {
        res.status(401).json({message: 'Not authorized as admin'})
    }
}

export { verifyJWT, admin }