const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = ({ _id }) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};
// Common login function for both admin and user
const login = async (role, req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(role, email, password);

    // Create a token
    const token = createToken({ _id: user._id });

    res.status(200).json({
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
      token,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Login admin
const loginAdmin = (req, res) => login("admin", req, res);

// Login user
const loginUser = (req, res) => login("user", req, res);

// Signup a user
const signupUser = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    const user = await User.signup(username, email, password, confirmPassword);

    // Create a token
    const token = createToken({ _id: user._id, username: user.username });
    await user.save;
    res.status(200).json({
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
      token,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = { signupUser, loginUser, loginAdmin };
