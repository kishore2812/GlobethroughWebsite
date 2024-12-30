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

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173", // Allow frontend from this domain
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow cookies and authorization headers
};

app.use(cors(corsOptions)); // Enable CORS with options

// Middleware
app.use(express.json({ limit: "50mb" })); // For parsing JSON with larger payloads
app.use(express.urlencoded({ limit: "50mb", extended: true })); // For parsing URL-encoded data

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
