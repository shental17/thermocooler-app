//Loads environment variables from a .env file into process.env
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const thermocoolerRoutes = require("./routes/thermoRoutes");
const profileRoutes = require("./routes/profileRoutes");
const energyUsageRoutes = require("./routes/energyUsageRoutes");
const adminRoutes = require("./routes/adminRoutes");

//Express App
const app = express();

//Middleware
app.use(express.json());

app.get((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/thermocooler", thermocoolerRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/energy", energyUsageRoutes);
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
