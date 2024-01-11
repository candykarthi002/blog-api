const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  getUserByName,
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getuser", protect, getUser);
router.get("/getuserbyname/:name", getUserByName);
router.get("/loggedin", loginStatus);

module.exports = router;
