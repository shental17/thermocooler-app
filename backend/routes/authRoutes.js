const express = require("express");

// controller functions
const {
  loginAdmin,
  loginUser,
  signupUser,
} = require("../controllers/authController");

const router = express.Router();

// Log in
router.post("/login", loginUser);

router.post("/admin-login", loginAdmin);

// Sign up
router.post("/signup", signupUser);

// Log out
router.post("/logout", (req, res) => {
  // Handle token invalidation if you're storing tokens server-side or on the client
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
