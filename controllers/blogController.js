const asyncHandler = require("express-async-handler");
const Blog = require("../models/blogs");
const BlogUser = require("../models/blogUser");

const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ _id: -1 });
  if (blogs) {
    res.status(200).json({ blogs: blogs });
  } else {
    res.status(404).json({ blogs: "No Blogs Found" });
  }
});

const addBlog = asyncHandler(async (req, res) => {
  const user = await BlogUser.findById(req.user._id);
  const { name } = user;
  if (user) {
    const { content } = await req.body;
    if (!content) {
      res.status(400);
      throw new Error("Provide all required information");
    }
    const blog = await Blog.create({
      user: name,
      content: content,
    });
    if (blog) {
      res.status(201).json({ msg: "Blog Created" });
    } else {
      res.status(400);
      throw new Error("Error Creating User");
    }
  } else {
    res.status(400);
    throw new Error("Unauthorized Access");
  }
});

module.exports = {
  getBlogs,
  addBlog,
};
