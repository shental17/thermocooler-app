const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  updateUserProfile,
  updatePassword,
} = require("../controllers/profileController");

const router = express.Router();

//require auth for all profile function
router.use(requireAuth);

// Update user profile information (Username, email, profile picture)
router.put("/", updateUserProfile);

// Change Password
router.put("/change-password", updatePassword);

module.exports = router;
