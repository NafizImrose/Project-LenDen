import "dotenv/config";

import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { requireAuth } from "./middleware.js";

import { ObjectId } from "mongodb";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://project-len-den.vercel.app"],
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
    amount: result,
  });
});

//profile
app.get("/profile", requireAuth, async (req, res) => {
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
    email: data.email,
    address: data.address || "",
    dob: data.dob || "",
    createTime: data.createdAt,
  });
});
//update profile

app.patch("/profile", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const { name, address, dob } = req.body;

  await db.collection("user").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        name: name,
        address: address,
        dob: dob,
      },
    },
  );

  const updatedUser = await db.collection("user").findOne({
    _id: new ObjectId(userId),
  });

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    profile: {
      name: updatedUser.name || "",
      email: updatedUser.email || "",
      address: updatedUser.address || "",
      dob: updatedUser.dob || "",
      createTime: updatedUser.createdAt || "",
      profilePicture: updatedUser.profilePicture || "",
    },
  });
});

// transaction api
app.get("/transactions", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const transactiondb = await db
    .collection("transactions")
    .find({ userId: userId })
    .sort({ createdAt: -1 })
    .toArray();
  res.status(200).json({
    success: true,
    data: transactiondb,
  });
});
//cash out
app.post("/cash-out", requireAuth, async (req, res) => {
  const outBalance = req.body.amount;
  const agentNumber = req.body.agentNumber;
  const user = req.user.id;

  const dataCollection = await db.collection("balance").findOne({
    userId: user,
  });
  if (dataCollection.balance < outBalance) {
    return res.status(404).json({
      success: false,
      message: "Insuffucient balance",
    });
  }
  const result = dataCollection.amount - outBalance;

  await db.collection("balance").updateOne(
    { userId: user },
    {
      $set: {
        amount: result,
      },
    },
  );

  // transaction
  const transactiondb = db.collection("transactions");

  await transactiondb.insertOne({
    userId: user,
    type: "Cash Out",
    amount: outBalance,
    agentNumber: agentNumber,
    createdAt: new Date(),
  });
  res.status(200).json({
    success: true,
    message: "Cash Out successfull",
    balance: result,
  });
});
//mobile recharge api
app.post("/mobile-recharge", requireAuth, async (req, res) => {
  try {
    const user = req.user.id;

    const amount = Number(req.body.amount);
    const { recipientNumber, operator, rechargeType } = req.body;

    // Amount validation
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid recharge amount",
      });
    }

    // Phone validation
    if (!/^01[3-9]\d{8}$/.test(recipientNumber || "")) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number",
      });
    }

    const balanceCollection = db.collection("balance");

    const data = await balanceCollection.findOne({
      userId: user,
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Balance not found",
      });
    }

    if (data.amount < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    const result = data.amount - amount;

    await balanceCollection.updateOne(
      { userId: user },
      {
        $set: {
          amount: result,
        },
      },
    );

    // Transaction history
    const transactiondb = db.collection("transactions");

    await transactiondb.insertOne({
      userId: user,
      type: "Mobile Recharge",
      amount: amount,
      recipientNumber,
      operator,
      rechargeType,
      createdAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Mobile recharge successful",
      balance: result,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});
//pay bill api
app.post("/pay-bill", requireAuth, async (req, res) => {
  try {
    const user = req.user.id;
    const amount = Number(req.body.amount);

    const balanceCollection = db.collection("balance");

    const data = await balanceCollection.findOne({
      userId: user,
    });

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    if (amount > data.amount) {
      return res.status(400).json({
        success: false,
        message: "Insuffient balance",
      });
    }
    const result = data.amount - amount;

    await balanceCollection.updateOne(
      {
        userId: user,
      },
      {
        $set: {
          amount: result,
        },
      },
    );

    //transaction
    const transaction = db.collection("transactions");

    await transaction.insertOne({
      userId: user,
      type: "Bill payment",
      amount: amount,

      createdAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Bill payment successful",
      balance: result,
    });
  } catch (error) {
    (console.log(error),
      res.status(400).json({
        success: false,
        message: "something went wrong",
      }));
  }
});

//payment api
app.post("/payment", requireAuth, async (req, res) => {
  try {
    const user = req.user.id;
    const amount = Number(req.body.amount);
    const merchant = req.body.merchantNumber;

    const balanceCollection = db.collection("balance");

    const data = await balanceCollection.findOne({
      userId: user,
    });

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    if (amount > data.amount) {
      return res.status(400).json({
        success: false,
        message: "Insuffient balance",
      });
    }
    const result = data.amount - amount;

    await balanceCollection.updateOne(
      {
        userId: user,
      },
      {
        $set: {
          amount: result,
        },
      },
    );

    //transaction
    const transaction = db.collection("transactions");

    await transaction.insertOne({
      userId: user,
      type: "Payment",
      amount: amount,
      merchantNumber: merchant,
      createdAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Payment successful",
      balance: result,
    });
  } catch (error) {
    (console.log(error),
      res.status(400).json({
        success: false,
        message: "something went wrong",
      }));
  }
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
