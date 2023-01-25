import mongoose, { Schema } from "mongoose";
import { TaskModel } from "../task";
import IGoal from "./goal.interface";

// refer: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/models/Pet.js

const GoalSchema: Schema = new Schema<IGoal>({
  title: {
    type: String,
    required: [true, "Please provide the title for the task item."],
  },
  totalTimeSpent: {
    type: Number,
    default: 0,
  },
  averageFocusLevel: {
    type: Number,
    default: 0,
  },
  tasks: {
    type: [TaskModel],
  },
});
const GoalModel =
  (mongoose.models?.Task as mongoose.Model<IGoal>) ||
  mongoose.model<IGoal>("Task", GoalSchema);

export default GoalModel;
