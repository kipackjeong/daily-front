import mongoose from "mongoose";
import { TimeInterval } from "../../types";

export interface ITask {
  _id?: string;
  detail?: string;
  date?: Date;
  reflection?: string;
  focusLevel?: number;
  position?: number;
  timeInterval?: TimeInterval;
  taskType?: "To Do" | "Did" | string;
  category?: string;
  goal?: mongoose.Types.ObjectId;
  priority?: number;
}
