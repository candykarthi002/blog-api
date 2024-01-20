const asyncHandler = require("express-async-handler");
const BlogUser = require("../models/blogUser");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = await req.body;
  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Provide all required information");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be atleast 6 char long.");
  }
  //   Check for email existence
  const userExists = await BlogUser.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email has Already been used by another user.");
  }

  // Password Hashing
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  //   Create user
  const user = await BlogUser.create({
    name,
    email,
    password: hashedPassword,
  });

  //generate token
  const token = generateToken(user._id);

  //send HTTP-only cookie
  res.cookie("jwt_token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  if (user) {
    res.status(201).json({ msg: "User Created", token: token, user: {...user, password: "" });
  } else {
    res.status(400);
    throw new Error("Error Creating User");
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("fill out email and password");
  }
  const user = await BlogUser.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("Invalid email, User Not found");
  }
  // Password validation
  const passwordIsCorrect = await bcryptjs.compare(password, user.password);
  if (user && passwordIsCorrect) {
    //generate token
    const token = generateToken(user._id);

    //send HTTP-only cookie
    res.cookie("jwt_token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({
      msg: "User Found",
      token: token,
      user: {...user, password: ""},
    });
  } else {
    res.status(400);
    throw new Error("Invalid password");
  }
});

//logout user
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt_token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });

  return res.status(200).json({ msg: "User Logged Out Successfully" });
});

// Get User Data
const getUser = asyncHandler(async (req, res) => {
  const user = await BlogUser.findById(req.user._id);
  if (user) {
    res.status(200).json({
      msg: "User Found",
      user: user,
    });
  } else {
    res.status(400);
    throw new Error("Invalid password");
  }
});

const getUserByName = asyncHandler(async (req, res) => {
  const user = await BlogUser.findOne({ name: req.params.name });
  if (user) {
    res.status(200).json({
      msg: "User Found",
      user: user,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User");
  }
});

const getUsersByName = asyncHandler(async (req, res) => {
  const users = await BlogUser.find({
    name: { $regex: `^${req.params.name}`, $options: "i" },
  });
  if (users) {
    res.status(200).json({
      msg: "User Found",
      users: users,
    });
  } else {
    res.status(400);
    throw new Error("No User Found");
  }
});

const loginStatus = asyncHandler(async (req, res) => {
  const token = await req.cookies.jwt_token;
  if (!token) {
    return res.json({ status: false });
  }
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    const { _id, name } = await BlogUser.findById(verified.id);
    return res.json({ status: true, id: _id, username: name });
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  getUserByName,
  getUsersByName,
  loginStatus,
};
