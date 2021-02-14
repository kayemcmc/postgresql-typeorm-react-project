// create a handler

import { isEmpty } from "class-validator";
import { Request, Response, Router } from "express";
import { getRepository } from 'typeorm'

import Sub from "../entities/Sub";
import User from "../entities/User";
import auth from "../middleware/auth";

const createSub = async (req: Request, res: Response) => {
    const { name, title, description } = req.body

    const user: User = res.locals.user

    try {
        let errors: any = {}
        if(isEmpty(name)) errors.name = 'Name must not be empty'
        if(isEmpty(title)) errors.title = "Title must not be empty"

        // if someone create a sub channel with a name it can only be one name 

        const sub = await getRepository(Sub).createQueryBuilder('sub').where('lower(sub.name) = :name', { name: name.toLowerCase() }).getOne()

        if(sub) errors.name = 'Sub exists already'

        if(Object.keys(errors).length > 0) {
            throw errors
        }

    } catch(err) {
        return res.status(400).json(err)
    }
    // if everything passes we get to this new try catch block
    try {
        const sub = new Sub({ name, description, title, user})

        await sub.save()
        return res.json(sub)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong'})
    }
}

const router = Router()

router.post('/', auth, createSub)

export default router