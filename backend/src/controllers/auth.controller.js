import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password, firstName, lastName, middleName } = req.body;

  try {
    if (!email || !password || !firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "Please fill-up the required fields" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = await User.create({
      email,
      firstName,
      lastName,
      middleName,
      password,
    });

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in signup ", error);
    res.status(500).json({ message: "Internal Server Error ", error });
  }
};
export const login = async (req, res) => {
  res.send("login Route");
};
export const logout = (req, res) => {
  res.send("logout Route");
};
