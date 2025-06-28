//register login logout  verifyaccout password function

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const register = async () => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: " Missing Details",
    });
  }

  try {
    const existingUser = await userModel.findone({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: " User Already Exist",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === " production" ? " none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
     return res.json({success : true})
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: " Email & Password are required ",
    });
  }

  try {
    const user = await userModel.findone({ email });
    if (!user) {
      return res.json({
        success: false,
        message: " Invalid Email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: " Invalid Password",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === " production" ? " none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({success : true});
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};



export const loginOut = async (req, res) => {}
