import mongoose from "mongoose";
import { DateModel } from "../models/app-date";
import CategoryModel from "../models/category/category.model";
import { TaskModel } from "../models/task";

const connectDB = (handler) => async (req, res) => {


  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return handler(req, res);
  }
  // Use new db connection
  await mongoose.connect(process.env.mongodburl);

  return handler(req, res);
};

export default connectDB;
