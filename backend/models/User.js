const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String, // URL or file path for profile picture
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
module.exports = mongoose.model("User", userSchema);
