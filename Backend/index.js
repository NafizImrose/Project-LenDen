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

    db = client.db("lenden"); // CHANGED HERE
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}

// Home API
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//first API
// Balance API
app.get("/balance", async (req, res) => {
  try {
    const balanceCollection = db.collection("balance");

    const userBalance = await balanceCollection.findOne({
      userId: "demo-user-1",
    });

    if (!userBalance) {
      return res.status(404).json({
        message: "Balance not found",
      });
    }

    res.status(200).json({
      success: true,
      balance: userBalance.amount,
      currency: userBalance.currency,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

//send money post api

app.post("/send-money", async (req, res) => {
  try {
    // 1. Receive amount from frontend
    const amount = Number(req.body.amount);

    // 2. Validate amount
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // 3. Select balance collection
    const balanceCollection = db.collection("balance");

    // 4. Atomically check balance and subtract amount
    const result = await balanceCollection.findOneAndUpdate(
      {
        userId: "demo-user-1",
        amount: { $gte: amount },
      },
      {
        $inc: { amount: -amount },
      },
      {
        returnDocument: "after",
      },
    );

    // 5. Check whether update was successful
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance or balance not found",
      });
    }

    // 6. Send updated balance to frontend
    res.status(200).json({
      success: true,
      message: "Money sent successfully",
      balance: result.amount,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Send money api
app.post("/add-money", async (req, res) => {
  const collection = db.collection("balance");

  const data = await collection.findOne({
    userId: "demo-user-1",
  });

  const recieved = Number(req.body.amount);

  const result = recieved + data.amount;

  await collection.updateOne(
    { userId: "demo-user-1" },
    {
      $set: {
        amount: result,
      },
    },
  );
  res.status(200).json({
    success: true,
    message: "Money sent successfully",
    Balance: result,
  });
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
