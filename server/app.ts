import userRouter from "./routes/user";

require("dotenv").config();

import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use("/api/v1", userRouter);

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
}); 

export { app };