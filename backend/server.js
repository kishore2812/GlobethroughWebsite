const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes"); // Import the user routes
const subuserRouter = require("./routes/subUserRoutes");
const setPasswordRouter = require("./routes/setPasswordRoutes");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS (if needed)

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Routes
app.use("/auth", authRouter); // Authentication routes
app.use("/api", userRouter); // User-related routes (protected)
app.use("/subuser", subuserRouter);
app.use("/setpassword", setPasswordRouter);
// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
