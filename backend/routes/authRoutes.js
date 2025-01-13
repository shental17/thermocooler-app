const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User"); // Assuming you have a User model

const router = express.Router();

// Sign up
router.post("/signup", (req, res) => {
  res.json({ message: "POST Sign up" });
});

// Log in
router.post("/login", (req, res) => {
  res.json({ message: "POST Log In" });
});

// Log out
router.post("/logout", (req, res) => {
  // Handle token invalidation if you're storing tokens server-side or on the client
  res.json({ message: "Logged out successfully" });
});

// // Sign up
// router.post("/signup", async (req, res) => {
//   const { email, password, username } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({ email, password: hashedPassword, username });
//     await newUser.save();

//     res.status(201).json({ message: "User created" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Log in
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Log out
// router.post("/logout", (req, res) => {
//   // Handle token invalidation if you're storing tokens server-side or on the client
//   res.json({ message: "Logged out successfully" });
// });

module.exports = router;
