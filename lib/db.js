import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://arpan:arpan@cluster0.zha0g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// console.log(MONGO_URI);
if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

/**
 * Cached connection for MongoDB.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
