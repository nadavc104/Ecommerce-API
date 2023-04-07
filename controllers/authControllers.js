import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

// @desc User login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username }).exec()


    if(!user || !user.active)
        return res.status(401).json({ message: 'Unauthorized' })
    
    const match = await user.matchPassword(password)
    
    if(!match) 
        return refresh.status(401).json({ message: 'Unauthorized' })
    
    const accessToken = jwt.sign(
        {
            'userInfo': {
                'username': user.username,
                'roles': user.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10m'}
    )

    const refreshToken = jwt.sign(
        { 'username': user.username},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d'}
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({accessToken})
})

// @desc Refresh token
// @route GET /auth/refresh
// @access Public
const refresh = asyncHandler(async (req, res) => {
    const cookies = req.cookies

    if(!cookies?.jwt)
        return res.status(401).json({ message: 'Unauthorized' })
    
    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if(err)
                return res.status(403).json({ message: 'Forbidden' })
            
            const user = await User.findOne({ username: decoded.username })

            if(!user) 
                return res.status(401).json({message: 'Unauthorized'})

            const accessToken = jwt.sign(
                {
                    'userInfo': {
                        'username': user.user,
                        'roles': user.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10m'}
            )

            res.json({ accessToken })
        })
    )
})

// @desc User logout
// @route POST /auth/logout
// @access Public
const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies

    if(!cookies?.jwt)
        return res.sendStatus(204)

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true})
    res.json({ message: 'Cookie cleared' })
})

export { login, refresh, logout }