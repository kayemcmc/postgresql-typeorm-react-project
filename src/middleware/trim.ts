import { Request, Response, NextFunction } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
    const exceptions = ['password']
    Object.keys(req.body).forEach(key => {
        // we are checking the value not the key itself
        // checking for the value of the key if the key is 'password' and it includes a string
        if(!exceptions.includes(key) &&typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].trim()
        }
    })
    next()
}