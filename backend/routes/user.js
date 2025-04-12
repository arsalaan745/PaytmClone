import express, { Router } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { User } from "../db.js";
import JWT_SECRET from "../config.js";

const router = Router();

//Zod schema for signup validation
const signupSchema = z.object({
  username: z.string().min(5),
  password: z.string().min(8),
  first_name: z.string(),
  last_name: z.string(),
});

//Signup Route
router.post("/signup", async (req, res) => {
  try {
    const body = req.body;

    //validating inputs
    const { success, error } = signupSchema.safeParse(body); //safeParse() is a method from Zod, and it always returns an object like this
    //{success: true, data: { ...yourValidData }}
    if (!success) {
      return res.status(411).json({
        message: "Email already taken / Incorrect inputs",
        errors: error.errors, //error.errors comes from Zod's ZodError object.
        //  optional: helpful for debugging/feedback
      });
    }

    // checking if the user already exists
    const existingUser = await User.findOne({
      username: body.username,
    });
    if (existingUser) {
      return res.status(411).json({
        message: "Email already taken / Incorrect inputs",
      });
    }

    // hashing pass before storing
    const hashedPassword = await bcrypt.hash(body.password, 10); // 10 is the salt rounds

    // creating user in the DB
    const user = await User.create({
      username: body.username,
      password: hashedPassword,
      first_name: body.first_name,
      last_name: body.last_name,
    });

    // Generating JWT token
    const userId = user._id;
    const token = jwt.sign(
      { userId: userId }, // can also write shorthand like {userId}
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "User created succesfully",
      token: token, // can also write shorthand like only token or token:token both are same
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
});

// zod schema for signin validation
const signinSchema = z.object({
  username: z.string().min(5),
  password: z.string().min(8),
});

//Signin Route
router.post("/signin", async (req, res) => {
  const body = req.body;

  // validating inputs
  const { success, error } = signinSchema.safeParse(body);
  if (!success) {
    return res.status(411).json({
      message: "Invlaid inputs",
      errors: error.errors,
    });
  }
});

export default router;
