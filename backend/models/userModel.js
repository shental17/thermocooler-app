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
    errors.password = "Please enter a password";
  }

  // Validate confirmPassword
  if (confirmPassword) {
    if (password !== confirmPassword) {
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

  return user;
};

// static login method
userSchema.statics.login = async function (role, email, password) {
  const errors = {};

  // Validate email and password presence
  if (!email) {
    errors.email = "Email is required";
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
  if (!user) {
    errors.general = "Incorrect email or password";
    throw { message: "Authentication error", errors };
  }

  // Validate password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
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
      await this.validateUsername(username);
      user.username = username;
    } catch (error) {
      errors.username = error.message; // Store the error message for the username field
    }
  }

  // Validate and update email
  if (email) {
    try {
      await this.validateEmail(email);
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
userSchema.statics.validateUsername = async function (username) {
  const usernameExists = await this.findOne({ username });
  if (usernameExists) {
    throw Error("Username has been taken");
  }
};

// Validate Email
userSchema.statics.validateEmail = async function (email) {
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }
  const emailExists = await this.findOne({ email });
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
