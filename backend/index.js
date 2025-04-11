import express from "express";

import cors from "cors"

import mainRouter from "./routes/index.js";

app.use(cors());
app.use(express.json());

const app = express();

app.use("/api/v1", mainRouter);

app.listen(3000);