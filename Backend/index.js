import "dotenv/config";

import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { requireAuth } from "./middleware.js";

import { ObjectId } from "mongodb";
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

const port = process.env.PORT || 8000;

let db;
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
// Test authenticated user
app.get("/me", requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User authenticated successfully",
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

//first API
// Balance API

app.get("/balance", requireAuth, async (req, res) => {
  try {
    const balanceCollection = db.collection("balance");

    // 1. Get logged-in user's unique ID
    const userId = req.user.id;

    // 2. Create balance if it doesn't exist
    await balanceCollection.updateOne(
      { userId: userId },
      {
        $setOnInsert: {
          amount: 0,
          currency: "BDT",
        },
      },
      { upsert: true },
    );

    // 3. Find this user's balance
    const userBalance = await balanceCollection.findOne({
      userId: userId,
    });

    // 4. Send response
    res.status(200).json({
      success: true,
      balance: userBalance.amount,
      currency: userBalance.currency,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

//send money post api

app.post("/send-money", requireAuth, async (req, res) => {
  try {
    // 1. Receive amount
    const recievedAmount = Number(req.body.amount);

    // 2. Validate amount
    if (!Number.isSafeInteger(recievedAmount) || recievedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // 3. Select collection
    const balanceCollection = db.collection("balance");

    const currentUser = req.user.id;
    // 4. Find current balance
    const result = await balanceCollection.findOne({
      userId: currentUser,
    });

    // 5. Check user exists
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 6. Check sufficient balance
    if (result.amount < recievedAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // 7. Calculate new balance
    const finalBalance = result.amount - recievedAmount;

    // 8. Update database
    await balanceCollection.updateOne(
      { userId: currentUser },
      {
        $set: {
          amount: finalBalance,
        },
      },
    );
    //transaction database update
    const recipientNumber = req.body.recipientNumber;
    const transaction = db.collection("transactions");

    await transaction.insertOne({
      userId: currentUser,
      amount: recievedAmount,
      recipientNumber: recipientNumber,
      type: "Send Money",
      createdAt: new Date(),
    });

    // 9. Send response
    res.status(200).json({
      success: true,
      message: "Money sent successfully",
      balance: finalBalance,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// add money api
app.post("/add-money", requireAuth, async (req, res) => {
  const collection = db.collection("balance");

  const userId = req.user.id;

  const data = await collection.findOne({
    userId: userId,
  });

  const recieved = Number(req.body.amount);

  const result = recieved + data.amount;

  await collection.updateOne(
    { userId: userId },
    {
      $set: {
        amount: result,
      },
    },
  );

  //transaction database update
  const bank = req.body.bank;
  const accountNumber = req.body.accountNumber;
  const transaction = db.collection("transactions");

  await transaction.insertOne({
    userId: userId,
    amount: recieved,
    accountNumber: accountNumber,
    bank: bank,
    type: "Add Money",
    createdAt: new Date(),
  });

  res.status(200).json({
    success: true,
    message: "Money sent successfully",
    Balance: result,
  });
});

//profile name api
app.get("/profile-name", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const userCollection = db.collection("user");
  const data = await userCollection.findOne({
    _id: new ObjectId(userId),
  });
  if (!data) {
    res.status(404).json({
      success: false,
      message: "user not found",
    });
  }
  res.status(200).json({
    success: true,
    name: data.name,
  });
});
// transaction api
app.get("/transactions", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const transactiondb = await db
    .collection("transactions")
    .find({ userId: userId })
    .sort({ created: 1 })
    .toArray();
  res.status(200).json({
    success: true,
    data: transactiondb,
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
