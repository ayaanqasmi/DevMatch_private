import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// @desc    Register a user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ msg: "enter all fields dimwit" });
    throw new Error("incomplete fields");
  }
  const isEmail = await userModel.findOne({ email });
  if (isEmail) {
    res.status(400).json ({ msg: "email already in use" });
    throw new Error("already in use");
  }

  const salt = bcrypt.genSaltSync(10);
  const hpassword = bcrypt.hashSync(password, salt);

  const newUser = await userModel.create({
    username,
    email,
    password: hpassword,
  });
  if (newUser) {
    res.status(201).json({ _id: newUser.id, username: newUser.username });
  } else {
    res.status(400).json({ msg: "couldnt create user" });
    throw new Error("no bueno");
  }
});

// @desc    Log in a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  
  const { email, password } = req.body;
  console.log(email,password)
  if (!email || !password) {
    res.status(400).json({ msg: "enter all fiel dimwit" });
    throw new Error("incomplete fields");
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(401).json({ msg: "no user with that email exists" });
    throw new Error("no user exists");
  }

  const isPassword = bcrypt.compareSync(password, user.password);

  if (!isPassword) {
    res.status(401).json({ msg: "wrong password" });
    throw new Error("wrong password");
  }
  var accessToken = jwt.sign(
    {
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,{expiresIn:"120m"}
  );
  res.cookie("jwt", accessToken, { httpOnly: true, sameSite: "None", secure: true , maxAge: 2*60*60*1000});
  res.status(200).json({ token: accessToken });
});

//@desc Current user info
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userModel.find();
  res.status(200).json({ success: true, data: users });
})
export { registerUser, loginUser, currentUser ,getAllUsers};