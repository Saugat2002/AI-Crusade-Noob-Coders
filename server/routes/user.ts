import express, { Request, Response, NextFunction } from "express";
import { handleRegister, handleSignIn, handleVerifyEmail, handleSignOut} from "../controllers/user";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

userRouter.post("/register", handleRegister);

userRouter.post("/signin", handleSignIn);

userRouter.get("/verify-email", handleVerifyEmail);

userRouter.post("/signout", handleSignOut);

const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    res
      .status(401)
      .json({ status: 401, message: "Unauthorized, Token Not Available" });
    return;
  } else {
    jwt.verify(token, process.env.JWT_SECRET_KEY!, (err: any, decoded: any) => {
      if (err) {
        res
          .status(401)
          .json({ status: 401, message: "Unauthorized, Wrong Token" });
        return;
      }
      next();
    });
  }
};

userRouter.get("/home", verifyUser, (req, res) => {
    res.status(200).json({ status: 200, message: "Welcome to Home Page" });
    return;
});

export default userRouter;
