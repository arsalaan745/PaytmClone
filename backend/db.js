import mongoose, {model} from "mongoose";


mongoose.connect(
  "mongodb+srv://Leo745:45hAIxZjzFs4oj1p@cluster0.kmdry.mongodb.net/PaytmApp"
);

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, trim: true, maxLength: 50 },
  last_name: { type: String, required: true, trim: true, maxLength: 50 },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: { type: String, required: true, minLength: 5 },
});

const accountSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance:{
    type: Number,
    required: true,
  },
});

export const User = model("User", userSchema);
export const Account = model("Account", accountSchema);
