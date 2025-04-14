import express, { Router } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { User } from "../db.js";
import bcrypt from "bcrypt";
import JWT_SECRET from "../config.js";
import authMiddleware from "../middleware.js";

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

  // finding user by username
  const user = await User.findOne({ username: body.username });
  if (!user) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  // compare hashed password with the entered one
  const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
  if (!isPasswordCorrect) {
    return res.status(411).json({
      message: "Invalid username or password",
    });
  }

  // after succesfull login create jwt token
  const userId = user._id;
  const token = jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: "1h" });
  res.json({
    message: "Signin succesfull",
    token: token,
  });
});

// zod schema for update validation
const updateBody = z.object({
  password: z.string().min(8).optional(), // optional used so user can only update anything from these
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  const body = req.body;

  const { success, error } = updateBody.safeParse(body);

  if (!success) {
    return res.status(411).json({
      message: " invalid inputs",
      errors: error.errors,
    });
  }

  // making the update object
  const updateData = {};
  if (body.first_name) updateData.first_name = body.first_name; //here we check that if first_name is present in the request body if it is there it add it to updateData object,
  //  this ensures only the fields user wants to update are sent to DB
  if (body.last_name) updateData.last_name = body.last_name;
  if (body.password) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    updateData.password = hashedPassword;
  }

  try {
    await User.updateOne({ _id: req.userId }, updateData);
    res.json({
      message: "Usr info updated succesfully",
    });
  } catch (err) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }
});

export default router;
