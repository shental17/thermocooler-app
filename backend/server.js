//Loads environment variables from a .env file into process.env
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const thermocoolerRoutes = require("./routes/thermoRoutes");
const profileRoutes = require("./routes/profileRoutes");
const energyRoutes = require("./routes/energyRoutes");
const adminRoutes = require("./routes/adminRoutes");

//Express App
const app = express();

//Middleware
app.use(express.json({ limit: "10mb" })); // Increase the limit to 10MB or more as needed
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Increase the limit to 10MB or more as needed

app.get((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/thermocooler", thermocoolerRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/energy", energyRoutes);
app.use("/api/admin", adminRoutes);

// app.listen(process.env.PORT, () =>
//   console.log(`Server running on port`, process.env.PORT)
// );
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((error) => {
    console.log(error);
  });
