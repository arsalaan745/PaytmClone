import express from "express";
import authMiddleware from "../middleware.js";
import { Account } from "../db.js";
import { z } from "zod";
import mongoose from "mongoose";

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });

  res.json({
    balance: account.balance,
  });
});

const transferSchema = z.object({
  amount: z.number().positive(),
  to: z.string().min(1),
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const body = req.body;

  // validating inputs
  const parsed = transferSchema.safeParse(body);
  if (!parsed.success) {
    return res.status(411).json({
      message: "Invalid inputs",
      errors: parsed.error.errors,
    });
  }

  const { amount, to } = parsed.data;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(
      session
    );

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    // making the transfer
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    // Committing the transaction so there is no partial trannsaction
    await session.commitTransaction();

    res.json({
      message: "Transfer successful",
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(411).json({
      message: "Internal server error",
      error: err,
    });
  } finally {
    session.endSession();
  }
});

export default router;
