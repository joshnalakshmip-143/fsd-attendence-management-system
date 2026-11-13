
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Attendance Management Backend is Running!");
});

// Health check API
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend server is working successfully"
  });
});

// Student APIs
app.use("/api/students", studentRoutes);

// Attendance APIs
app.use("/api/attendance", attendanceRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
