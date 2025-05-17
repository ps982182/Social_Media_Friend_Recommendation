const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const path = require("path");

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Parse JSON bodies
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose
  .connect("mongodb://localhost/socialmedia", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
