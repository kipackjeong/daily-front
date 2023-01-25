import mongoose, { Schema } from "mongoose";
import ICategory from "./category.interface";

const CategorySchema: Schema = new Schema<ICategory>({
  title: {
    type: String,
    required: [true, "Please provide the title for the task item."],
  },
  icon: {
    type: String,
    required: [true, "Please select icon to use for this category."],
  },
  totalTimeSpent: {
    type: Number,
    default: 0,
  },
  averageFocusLevel: {
    type: Number,
    default: 0,
  },
});

const CategoryModel =
  (mongoose.models?.Category as mongoose.Model<ICategory>) ||
  mongoose.model<ICategory>("Category", CategorySchema);

export default CategoryModel;
