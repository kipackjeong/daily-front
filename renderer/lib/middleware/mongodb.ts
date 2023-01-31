import mongoose from "mongoose";
import isDev from "electron-is-dev";

const connectDB = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return handler(req, res);
  }
  // Use new db connection
  if (isDev) await mongoose.connect(process.env.dev_mongodburl);
  else await mongoose.connect(process.env.prod_mongodburl);

  return handler(req, res);
};

export default connectDB;
