const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user", // Default role is user, admin will have 'admin' role
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
