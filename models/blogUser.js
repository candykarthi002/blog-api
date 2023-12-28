const mongoose = require("mongoose");

const blogUserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter a name"],
    },
    email: {
      type: String,
      required: [true, "Please Enter a name"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minLength: [6, "Password should be atleast 6 chars long"],
    },
    photo: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReFoOgeB5qrZKrSbtfML7jBbGlQ6WstdyVOyc-tRUWqA&s",
    },
  },
  {
    timestamps: true,
  }
);

const BlogUser = mongoose.model("BlogUser", blogUserSchema);
module.exports = BlogUser;
