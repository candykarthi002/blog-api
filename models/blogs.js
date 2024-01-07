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
      type: Array,
    },
    comments: [
      {
        type: new mongoose.Schema(
          {
            user: mongoose.Schema.ObjectId,
            username: String,
            content: String,
          },
          { timestamps: true }
        ),
      },
    ],
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
