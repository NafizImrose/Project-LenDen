import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_URL);
const db = client.db("lenden");

export const auth = betterAuth({
  //...other options
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },

  database: mongodbAdapter(db, {
    client,
  }),
});
