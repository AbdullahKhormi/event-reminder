const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Routes
const eventRouter = require("./routes/event");
const usersRouter = require("./routes/users");

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Server Running");
});

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "api-events",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" Connected to MongoDB Atlas");
  } catch (err) {
    console.error(" MongoDB connection error:", err.message);
  }
}
connectDB();

// Use routes
app.use("/event", eventRouter);
app.use("/users", usersRouter);

// Start server
app.listen(port, () => {
  console.log(" Server running on port", port);
});
