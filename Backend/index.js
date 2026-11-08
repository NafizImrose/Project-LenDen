const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient } = require("mongodb");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI);

async function connectDB() {
  try {
    await client.connect();

    console.log("MongoDB connected successfully!");

    return client.db("lenden");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}

// Home API
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start server
async function startServer() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
  }
}

startServer();
