import mongoose, { Schema } from "mongoose";
import ICategory from "../category/category.interface";
import ITask from "./task.interface";
// refer: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/models/Pet.js

const TaskSchema: Schema = new Schema<ITask>({
  title: {
    type: String,
  },
  description: {
    type: String,
    default: "",
  },
  focusLevel: {
    type: Number,
    default: 50,
  },
  position: {
    type: Number,
  },
  date: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Date",
  },
  timeInterval: {
    type: { startTime: Date, endTime: Date },
  },
  taskType: {
    type: String,
    enum: ["TODO", "DID"],
    default: "TODO",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  goal: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

const TaskModel =
  (mongoose.models?.Task as mongoose.Model<ITask>) ||
  mongoose.model<ITask>("Task", TaskSchema);

export default TaskModel;
