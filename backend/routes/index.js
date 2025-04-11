import express from "express";
import userRouter from "./user";
import { Router } from "express";

Router.use("/user", userRouter);

export default Router;