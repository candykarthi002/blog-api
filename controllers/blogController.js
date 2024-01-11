const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
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

const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    res.status(200).json({ blog: blog });
  } else {
    res.status(404).json({ blog: "No Blogs Found" });
  }
});

const getBlogByUserId = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ user: req.params.id });
  if (blogs) {
    res.status(200).json({ blogs: blogs });
  } else {
    res.status(404).json({ blog: "No Blogs Found" });
  }
});

const likeBlog = asyncHandler(async (req, res) => {
  const user = jwt.verify(await req.cookies.jwt_token, process.env.JWT_SECRET);
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    if (!blog.likes.includes(user.id)) {
      blog.likes.push(user.id);
      blog.save();
    } else {
      blog.likes.splice(blog.likes.indexOf(user.id), 1);
      blog.save();
    }
    console.log(blog.likes);
    res.status(200).json(blog);
  } else {
    res.status(400).json({ msg: "Error updating like" });
  }
  // console.log(jwt.verify(await req.cookies.jwt_token, process.env.JWT_SECRET));
  // console.log(req.params.id);
});

const commentBlog = asyncHandler(async (req, res) => {
  const user = jwt.verify(await req.cookies.jwt_token, process.env.JWT_SECRET);
  const blog = await Blog.findById(req.params.id);
  const { name } = await BlogUser.findById(user.id);
  const { comment } = req.body;
  if (blog) {
    blog.comments.push({ user: user.id, username: name, content: comment });
    blog.save();
    res.status(200).json(blog);
  } else {
    res.status(400).json({ msg: "Error updating like" });
  }
  // console.log(jwt.verify(await req.cookies.jwt_token, process.env.JWT_SECRET));
  // console.log(req.params.id);
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
  likeBlog,
  getBlogById,
  getBlogByUserId,
  commentBlog,
};
