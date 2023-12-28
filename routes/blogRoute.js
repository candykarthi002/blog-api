const express = require("express");
const router = express.Router();
const { getBlogs, addBlog } = require("../controllers/blogController");
const protect = require("../middlewares/authMiddleware");

router.post("/addblog", protect, addBlog);
router.get("/getblogs", getBlogs);

module.exports = router;
