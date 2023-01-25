import mongoose, { Schema } from "mongoose";
import AppDate from "./app-date.class";
import IAppDate from "./app-date.interface";

export const monthsMap = {
  January: 0,
  Feburary: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

export const daysMap = {
  Sunday: 0,
  Monday: 1,
  Tueday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const DateSchema = new Schema<AppDate>(
  {
    year: {
      type: Number,
      required: [true, "The attribute 'year' is required to create Date."],
    },
    month: {
      type: Number,
      required: [true, "The attribute 'month' is required to create Date"],
    },
    date: {
      type: Number,
      required: [true, "The attribute 'date' is required to create Date"],
    },
    day: {
      type: Number,
      required: [true, "The attribute 'day' is required to create Date"],
    },
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

DateSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "date",
  justOne: false,
});

const DateModel =
  (mongoose.models?.Date as mongoose.Model<IAppDate>) ||
  mongoose.model<IAppDate>("Date", DateSchema);

export default DateModel;
