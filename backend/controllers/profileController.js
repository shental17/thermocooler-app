const mongoose = require("mongoose");
const User = require("../models/userModel");
const updateUserProfile = async (req, res) => {
  try {
    const { username, email, profilePicture } = req.body;

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    const userId = req.user._id;
    console.log("User ID:", userId);

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Call the updateDetails method on the User model, passing the user object
    try {
      const updatedUser = await User.updateDetails(
        username,
        email,
        profilePicture,
        user // Pass the user object here
      );

      // Respond with the updated user information
      res.status(200).json({
        message: "User profile updated successfully.",
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          profilePicture: updatedUser.profilePicture,
        },
      });
    } catch (error) {
      // Catch the error thrown by updateDetails and send the error messages
      const errors = JSON.parse(error.message); // Parse the error message into an object
      res.status(400).json({ errors }); // Return the errors in the response
    }
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({ error: "Failed to update user profile." });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword, confirmNewPassword } = req.body;

    console.log("Password: " + password);
    console.log("New Password: " + newPassword);
    console.log("confirmNewPassword" + confirmNewPassword);

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    const userId = req.user._id;
    console.log("User ID:", userId);

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    try {
      await User.changePassword(
        password,
        newPassword,
        confirmNewPassword,
        user
      );

      // Respond with the updated user information
      res.status(200).json({
        message: "Password updated successfully.",
      });
    } catch (error) {
      const errors = JSON.parse(error.message); // Parse the error message into an object
      res.status(400).json({ errors }); // Return the errors in the response
    }
  } catch (error) {
    console.error("Error updating user password:", error.message);
    res.status(500).json({ error: "Failed to update user password." });
  }
};

module.exports = { updateUserProfile, updatePassword };
