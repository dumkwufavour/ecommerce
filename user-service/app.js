const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_PASS:', process.env.GMAIL_PASS);

// Routes
app.use("/api/v1", userRoutes);
app.use(limiter); // Apply to all routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
