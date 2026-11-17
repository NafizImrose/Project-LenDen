import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("lenden");

export const auth = betterAuth({
  baseURL: "https://project-len-den.vercel.app",
  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
});
