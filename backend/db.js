import mongoose from "mongoose";
import { string } from "zod";

mongoose.connect(
  "mongodb+srv://Leo745:45hAIxZjzFs4oj1p@cluster0.kmdry.mongodb.net/PaytmApp"
);

const userSchema = new mongoose.Schema({
  first_name: { type: string, required: true, trim: true, maxLength: 50 },
  last_name: { type: string, required: true, trim: true, maxLength: 50 },
  username: {
    type: string,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: { type: string, required: true, minLength: 5 },
});

export const User = model("User", userSchema)