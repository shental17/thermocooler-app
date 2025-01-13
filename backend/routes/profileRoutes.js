const express = require("express");

const router = express.Router();

// Update user profile information (Username, email, password)
router.put("/:id", (req, res) => {
  res.json({ message: "UPDATE user profile information" });
});

// Update profile picture of user
router.patch("/:id/picture", (req, res) => {
  res.json({ message: "UPDATE profile picture" });
});

module.exports = router;
