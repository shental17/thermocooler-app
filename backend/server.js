//Loads environment variables from a .env file into process.env
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

//Express App
const app = express();

//Middleware
app.use(express.json());

app.get((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
// app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.json({ mssg: "Welcome to the app" });
});

console.log(process.env.PORT);
app.listen(process.env.PORT, () =>
  console.log(`Server running on port`, process.env.PORT)
);
// mongoose.connect(process.env.MONGO_URI).then(() => {
//   //listen for requests
//   app.listen(process.env.PORT, () =>
//     console.log(`Server running on port ${process.env.PORT}`)
//   );
// });
