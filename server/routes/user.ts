import express, { Request, Response, NextFunction } from "express";
import {
  handleRegister,
  handleSignIn,
  handleVerifyEmail,
  handleSignOut,
} from "../controllers/user";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: any; // Adjust the type as needed
}

const userRouter = express.Router();

userRouter.post("/register", handleRegister);

userRouter.post("/signin", handleSignIn);

userRouter.get("/verify-email", handleVerifyEmail);

userRouter.post("/signout", handleSignOut);

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
