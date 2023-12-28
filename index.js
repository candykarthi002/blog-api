const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute");
const errorHandler = require("./middlewares/errorMiddleware");
const cookieParser = require("cookie-parser");
const Blog = require("./models/blogs");

const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "https://blogsphere-app.netlify.app", credentials: true }));

// Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/blogs", blogRoute);

// Routes
app.get("/", (req, res) => {
  console.log("Home");
  res.json({ msg: "Home" });
});

// Error Middleware
app.use(errorHandler);

// DB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server Running on port " + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
