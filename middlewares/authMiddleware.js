const asyncHandler = require("express-async-handler");
const BlogUser = require("../models/blogUser");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.jwt_token;
    if (!token) {
      res.status(401);
      throw new Error("Unauthorized Access");
    }
    //Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    //get user id
    const user = await BlogUser.findById(verified.id).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(401);
    throw new Error("Unauthorized Access");
  }
});

module.exports = protect;
