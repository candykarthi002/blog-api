const express = require("express");
const router = express.Router();
const {
  getBlogs,
  addBlog,
  likeBlog,
  getBlogById,
  commentBlog,
} = require("../controllers/blogController");
const protect = require("../middlewares/authMiddleware");

router.post("/addblog", protect, addBlog);
router.get("/getblogs", getBlogs);
router.get("/getblog/:id", getBlogById);
router.put("/like/:id", protect, likeBlog);
router.put("/comment/:id", protect, commentBlog);

module.exports = router;
