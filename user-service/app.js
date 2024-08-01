const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const rateLimit = require('express-rate-limit');
require("dotenv").config();

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use(limiter); // Apply to all routes

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
