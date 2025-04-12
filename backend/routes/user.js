import express, {Router} from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { User } from "../db.js";
import JWT_SECRET from "../config.js";

const router = Router();

//Zod schema for validation
const signupSchema = z.object({
    username: z.string().min(5),
    password: z.string().min(8),
    first_name: z.string(),
    last_name: z.string(),
});

router.post("/signup", async(req, res)=>{
    const body = req.body;
    const {success, error} = signupSchema.safeParse(body);  //safeParse() is a method from Zod, and it always returns an object like this 
    //{success: true, data: { ...yourValidData }} 
    if(!success){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs",
            errors: error.errors, //error.errors comes from Zod's ZodError object.
            //  optional: helpful for debugging/feedback
        })
    }
    const existingUser =await User.findOne({
        username : body.username
    })
    if(existingUser){
        return res.status(411).json({
         message: "Email already taken / Incorrect inputs"
        })
    }
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;
    const token = jwt.sign({
        userId: user._id
    }, JWT_SECRET);

    res.json({
        message:"User created succesfully",
        token: token
    })
})


export default router;
