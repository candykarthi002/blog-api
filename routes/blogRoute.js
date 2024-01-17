const express = require("express");
const router = express.Router();
const {
  getBlogs,
  addBlog,
  likeBlog,
  getBlogById,
  getBlogByUserId,
  commentBlog,
  deleteBlog,
  deleteComment,
} = require("../controllers/blogController");
const protect = require("../middlewares/authMiddleware");

router.post("/addblog", protect, addBlog);
router.get("/getblogs", getBlogs);
router.get("/getblog/:id", getBlogById);
router.get("/getblogsbyuser/:id", getBlogByUserId);
router.delete("/deleteblog/:id", deleteBlog);
router.delete("/deletecomment/:id", deleteComment);
router.put("/like/:id", protect, likeBlog);
router.put("/comment/:id", protect, commentBlog);

module.exports = router;
