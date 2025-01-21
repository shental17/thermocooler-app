const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePicture: {
      type: String, // URL or file path for profile picture
      default: "https://example.com/default-profile.png",
    },
    thermocoolers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thermocooler",
      },
    ],
  },
  { timestamps: true }
);

// static signup method
userSchema.statics.signup = async function (
  username,
  email,
  password,
  confirmPassword
) {
  // validation
  if (!email || !password || !confirmPassword) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }
  if (password !== confirmPassword) {
    throw Error("Passwords do not match");
  }

  const usernameExists = await this.findOne({ username });
  const emailExists = await this.findOne({ email });

  if (usernameExists) {
    throw Error("Username already in use");
  }

  if (emailExists) {
    throw Error("Email already in use");
  }

  //Hashed password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ email, username, password: hash });

  return user;
};

// static login method
userSchema.statics.login = async function (role, email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  // Check if the user is an admin after authentication
  if (role == "admin") {
    await this.checkAdminRole(user);
  }

  return user;
};

// Check if the user has the admin role
userSchema.statics.checkAdminRole = async function (user) {
  if (user.role !== "admin") {
    throw Error("Access denied. Admins only.");
  }
};

module.exports = mongoose.model("User", userSchema);
