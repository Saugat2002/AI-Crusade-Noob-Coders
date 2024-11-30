require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import Token from "../models/token";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendMail from "../utils/sendMail";

export const handleRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fullName, email, password, gender, guardiansEmail } = req.body;
    console.log(req.body);
    
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        res.status(500).json({ status: 500, message: "Internal server error" });
        return;
      }
      const user = await User.create({
        fullName,
        email,
        password: hash,
        gender,
        guardiansEmail,
      });
      console.log(user);
      

      const token = await Token.create({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });

      const url = `${process.env.CLIENT_URL}/verify-email?id=${user._id}&token=${token.token}`;
      await sendMail(user.email, "Verify Email", url);
      console.log("Test", user, token);

      res.status(201).json({
        message:
          "An Email has been sent to your account. Please Verify using the provided link.",
      });
    });
  } catch (err) {
    console.error("Error creating user:", err);

    if ((err as any).code === 11000) {
      res.status(409).json({ status: 409, message: "Email already exists" });
    } else {
      res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }
};

export const handleSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  console.log(user);

  if (!user) {
    res.status(404).json({ status: 404, message: "User not found" });
    return;
  }
  bcrypt.compare(password, user.password, async (err, result) => {
    if (err) {
      res.status(500).json({ status: 500, message: "Internal server error" });
      return;
    }
    if (!result) {
      res.status(401).json({ status: 401, message: "Incorrect password" });
      return;
    }
    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await Token.create({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        });
        const url = `${process.env.CLIENT_URL}/verify-email?id=${user._id}&token=${token.token}`;
        await sendMail(user.email, "Verify Email", url);
      }
      return res.status(400).json({
        status: 400,
        message:
          "An email has been sent to your email, Please Verify using the provided Link",
      });
    }
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY!);
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({
      status: 200,
      message: "User signed in successfully",
      user: user,
    });
  });
};

export const handleVerifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Query:", req.query);
    let user = await User.findOne({ _id: req.query.id });

    if (!user) {
      res.status(400).json({ status: 400, message: "Invalid Link" });
      return;
    }
    const token = await Token.findOne({
      userId: req.query.id,
      token: req.query.token,
    });
    if (!token) {
      res.status(400).json({ status: 400, message: "Invalid Link, Query" });
      return;
    }
    const updatedUser = await User.updateOne(
      { _id: user._id },
      { verified: true }
    );
    // console.log(user);
    // console.log(updatedUser);
    await Token.deleteOne({ userId: user._id });
    res
      .status(200)
      .json({ status: 200, message: "Email verified successfully" });
  } catch (err) {
    console.error("Error verifying email:");
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

export const handleSignOut = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res
    .status(200)
    .json({ status: 200, message: "User signed out successfully" });
};
