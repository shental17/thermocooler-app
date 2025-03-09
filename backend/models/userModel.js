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
    electricityTariff: {
      type: Number,
      default: 0,
    },
    profilePicture: {
      type: String,
      default:
        "data:image/png;base64,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",
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
  const errors = {};

  // Validate username
  if (username) {
    try {
      await this.validateUsername(username);
    } catch (error) {
      errors.username = error.message; // Collect username-specific error
    }
  } else {
    errors.username = "Please enter your username";
  }

  // Validate email
  if (email) {
    try {
      await this.validateEmail(email);
    } catch (error) {
      errors.email = error.message; // Collect email-specific error
    }
  } else {
    errors.email = "Please enter your email";
  }

  // Validate password
  if (password) {
    if (!validator.isStrongPassword(password)) {
      errors.password =
        "Password must have at least 8 characters, including numbers, letters, and special characters (!$@%)";
    }
  } else {
    errors.password = "Please enter your password";
  }

  // Validate confirmPassword
  if (confirmPassword) {
    if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
    }
  } else {
    errors.confirmPassword = "Please confirm your password";
  }

  // Check for errors
  if (Object.keys(errors).length > 0) {
    throw { message: "Validation errors", errors }; // Throw a structured error object
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Create the user
  const user = await this.create({ email, username, password: hash });
  console.log("user created");

  return user;
};

// static login method
userSchema.statics.login = async function (role, email, password) {
  const errors = {};

  // Validate email and password presence
  if (!email) {
    errors.email = "Email is required";
  } else {
    if (!validator.isEmail(email)) {
      errors.email = "Email is not valid";
    }
  }
  if (!password) {
    errors.password = "Password is required";
  }

  // Check if email or password are missing and return the error object
  if (Object.keys(errors).length > 0) {
    throw { message: "Validation errors", errors };
  }

  // Check if the user exists
  const user = await this.findOne({ email });
  //Validate password
  const match = await bcrypt.compare(password, user.password);
  if (!user || !match) {
    errors.general = "Incorrect email or password";
    throw { message: "Authentication error", errors };
  }

  // Check role if admin
  if (role === "admin") {
    try {
      await this.checkAdminRole(user);
    } catch (err) {
      errors.role = "User does not have admin privileges";
      throw { message: "Authorization error", errors };
    }
  }

  return user;
};

// static update details method
userSchema.statics.updateDetails = async function (
  username,
  email,
  profilePicture,
  user
) {
  const errors = {};

  // Validate and update username
  if (username) {
    try {
      await this.validateUsername(username, user._id);
      user.username = username;
    } catch (error) {
      errors.username = error.message; // Store the error message for the username field
    }
  }

  // Validate and update email
  if (email) {
    try {
      await this.validateEmail(email, user._id);
      user.email = email;
    } catch (error) {
      errors.email = error.message; // Store the error message for the email field
    }
  }

  // Validate and update email
  if (profilePicture) {
    user.profilePicture = profilePicture;
  }

  // If there are validation errors, return them
  if (Object.keys(errors).length > 0) {
    throw new Error(JSON.stringify(errors)); // Throw an error with the collected errors
  }
  // Save and return the updated user
  await user.save();
  return user;
};

// static update details method
userSchema.statics.changePassword = async function (
  password,
  newPassword,
  confirmNewPassword,
  user
) {
  const errors = {};

  // Validate current password
  if (password) {
    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.password = "Incorrect password";
      }
    } catch (error) {
      errors.password = error.message;
    }
  } else {
    errors.password = "Please enter your current password.";
  }

  // Validate new password only if current password is valid
  if (!errors.password) {
    if (!newPassword) {
      errors.newPassword = "Please enter your new password.";
    } else {
      if (newPassword === password) {
        errors.newPassword =
          "New password is the same as the current password.";
      }
      if (!validator.isStrongPassword(newPassword)) {
        errors.newPassword =
          "New password must have at least 8 characters, including numbers, letters, and special characters (!$@%).";
      }
    }

    if (!confirmNewPassword) {
      errors.confirmNewPassword = "Please confirm your new password.";
    } else if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = "New passwords do not match.";
    }
  }

  // If there are validation errors, throw them
  if (Object.keys(errors).length > 0) {
    throw new Error(JSON.stringify(errors));
  }

  // Hash and update the password if valid
  if (newPassword && newPassword === confirmNewPassword) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
  }

  // Save and return the updated user
  await user.save();
  return user;
};

// Validate Username
userSchema.statics.validateUsername = async function (username, userId = null) {
  const query = { username };
  if (userId) {
    query._id = { $ne: userId }; // Exclude the current user's ID
  }
  const usernameExists = await this.findOne(query);
  if (usernameExists) {
    throw Error("Username has been taken");
  }
};

// Validate Email
userSchema.statics.validateEmail = async function (email, userId = null) {
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }
  const query = { email };
  if (userId) {
    query._id = { $ne: userId }; // Exclude the current user's ID
  }
  const emailExists = await this.findOne(query);
  if (emailExists) {
    throw Error("Email has already been registered to an account");
  }
};

// Check if the user has the admin role
userSchema.statics.checkAdminRole = async function (user) {
  if (user.role !== "admin") {
    throw Error("Access denied. Admins only.");
  }
};

module.exports = mongoose.model("User", userSchema);
