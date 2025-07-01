//register login logout  verifyaccout password function

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { Verified } from "lucide-react";

export const register = async (req, res) => {
  //console.log("req.body is:", req.body);

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: " Missing Details",
    });
  }

  try {
    const existingUser = await userModel.findOne({ email });
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
    // sending welcome Email
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      sunject: `Welcome to Vaibhav's Website`,
      text: `Welcome to Vaibhav's Website, Your account has been created successfully with mail id ${email}`,
    };
    await transporter.sendMail(mailOption);

    return res.json({ success: true });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  // console.log("req.body is:", req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: " Email & Password are required ",
    });
  }

  try {
    const user = await userModel.findOne({ email });
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
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
    });
    return res.json({ success: true });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === " production",
      sameSite: process.env.NODE_ENV === "production" ? " none" : "strict",
    });
    return res.json({ success: true, message: "logut successfully" });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//send verification otp to users email
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);
    if (user.isAccountverified) {
      return res.json({
        success: false,
        message: " Account Already Verified",
      });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; //1day
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: `Account Verification OTP`,
      text: `Your OTP is ${otp}. Verified your account buy using this OTP`,
    };
    await transporter.sendMail(mailOption);
    res.json({
      success: true,
      message: "Verification OTP sent on your Email",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  console.log("BODY:", req.body);
  const { otp, userId } = req.body;
  if (!otp || !userId) {
    return res.json({
      success: false,
      message: "Missing OTP or verification ID",
    });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }
    user.isAccountverified = true;
    user.verifyOtp = " ";
    user.verifyOtpExpireAt = 0;

    await user.save();
    res.json({
      success: true,
      message: "Email verified Successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// check  if user is authenticated
export const isAuthenticated = (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//send password reset otp
export const sendResetOtp = async (req, res) => {
  console.log("req.body:",req.body)
  const { email } = req.body;
  if (!email) {
    return res.json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await userModel.findOne({email});

    if (!user) {
      return res.json({
        success: false,
        message: "User is not founf",
      });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; //15 min
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: `Password reset OTP`,
      text: `Your OTP for resetting your password is ${otp}, use this otp to proceed with resetting your password`,
    };
    await transporter.sendMail(mailOption);
    return res.json({
      success:true,
      message: "OTP sent to your mobile"
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


export const resetPassword =async(req,res)=>{
  const{email,otp,newPassword}= req.body;
  if (!email || !newPassword || !otp ) {
    return res.json({
      success:false,
      message:"Email,Otp &NewPassword are required"
    })
  }
  try {
    const user = await userModel.findOne({email});
     if (!user) {
    return res.json({
      success:false,
      message:"User not found"
    });
  }
  if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt > Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }
    const hashedPassword = await bcrypt.hash(newPassword,10)
    user.password = hashedPassword;
    user.resetOtp ="";
    user.resetOtpExpireAt=0;
    await user.save();
     return res.json({
      success:true,
      message:"Password has been  reset successfully"
    })
  } catch (error) {
     res.json({
      success: false,
      message: error.message,
    }); 
  }


}
