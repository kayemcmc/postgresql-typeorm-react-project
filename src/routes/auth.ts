import { json, Request, response, Response, Router } from "express"
import { isEmpty, validate } from "class-validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cookie from "cookie"

import User from '../entities/User'
import auth from '../middleware/auth'

//base62 secure token

const register = async (req: Request, res: Response) => {
   const {email, username, password} = req.body
   try {
    // TODO validate data
    let errors: any = {}
    const emailUser = await User.findOne({ email })
    const usernameUser = await User.findOne({ username })

    if(emailUser) errors.email = 'Email is already taken'
    if(usernameUser) errors.username = 'Username is already taken'

    if(Object.keys(errors).length > 0) {
        return res.status(400).json(errors)
    }
    
    // TODO Create the user
    // new calls the constructor
    const user = new User({ email, username, password})
    errors = await validate(user)
    if(errors.length > 0) return res.status(400).json({ errors })
    await user.save()
    // TODO: Return the user
    return res.json(user)
   } catch (err) {
    console.log(err)
    return res.status(500).json(err)
   }
}

// login route takes a username and a password
// look in the database to see if user exists if not
// we will return an error
// if there is then we compare the password and carry 
// on with auth
const login = async (req: Request, res: Response) => {

    const {username, password} = req.body

    try {
        let errors: any = {}
  
        const user = await User.findOne({ username })

        if(isEmpty(username)) errors.username = "Username cannot be empty"
        if(isEmpty(password)) errors.password = "Password cannot be empty"

        if(Object.keys(errors).length > 0) {
            return res.status(400).json(errors)
        }

        if (!user) return res.status(404).json({ user: 'User not found' })

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch) res.status(401).json({ password: "Password is incorrect, try again"})
        // store in payload with .sign
        const token = jwt.sign({ username }, process.env.JWT_SECRET)
        res.set('Set-Cookie', cookie.serialize('token', token, {
            // cannot access by js
            httpOnly: true,
            //TODO make true for https
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            // 1 hour
            maxAge: 3600,
            // the whole site
            path: '/'
        }))
        return res.json(user)
        // password is correct generate a json webtoken
        // sent to the users machine for the machine to tell the server user is logged in
    } catch (err) {

    }
}

const me =  (_: Request, res: Response) => {
  return res.json(res.locals.user)
}

const logout = (_: Request, res: Response) => {
    //expire date is expired
    res.set('Set-Cookie', cookie.serialize('token', '', {
      // cannot access by js
      httpOnly: true,
      //TODO make true for https
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      // 1 hour
      expires: new Date(0),
      // the whole site
      path: '/'  
    }))
    return res.status(200).json({ success: true })
}
const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/me', auth, me)
router.get('/logout', auth, logout)

export default router;