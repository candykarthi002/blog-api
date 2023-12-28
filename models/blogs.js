const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: [true],
    },
    content: {
      type: String,
      required: [true],
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
