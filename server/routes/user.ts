import express, { Request, Response, NextFunction } from "express";
import {
  handleRegister,
  handleSignIn,
  handleVerifyEmail,
  handleSignOut,
} from "../controllers/user";
import {
  handleAddTask,
  handleDeleteTask,
  handleUpdateTask,
} from "../controllers/task";
import jwt from "jsonwebtoken";
import Task from "../models/task";

interface CustomRequest extends Request {
  user?: any; // Adjust the type as needed
}

const userRouter = express.Router();

userRouter.post("/register", handleRegister);

userRouter.post("/signin", handleSignIn);

userRouter.get("/verify-email", handleVerifyEmail);

userRouter.post("/signout", handleSignOut);

userRouter.post("/addTask", handleAddTask);

userRouter.post("/deleteTask", handleDeleteTask);

userRouter.post("/updateTask", handleUpdateTask);

userRouter.get("/fetchTasks", async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json({ status: 200, tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
});

const verifyUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  // console.log(token);
  if (!token) {
    console.log("Token Not Available");
    res
      .status(401)
      .json({ status: 401, message: "Unauthorized, Token Not Available" });
    return;
  } else {
    jwt.verify(token, process.env.JWT_SECRET_KEY!, (err: any, decoded: any) => {
      if (err) {
        console.log("Err Not Available");
        res
          .status(401)
          .json({ status: 401, message: "Unauthorized, Wrong Token" });
        return;
      }
      req.user = decoded;
      next();
    });
  }
};

userRouter.get(
  "/user-info",
  verifyUser,
  (req: CustomRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      res
        .status(401)
        .json({ status: 401, message: "Unauthorized, User Not Found" });
    } else {
      res.status(200).json({ user });
    }
  }
);

userRouter.get("/home", verifyUser, (req, res) => {
  res.status(200).json({ status: 200, message: "Welcome to Home Page" });
  return;
});

export default userRouter;
