// db.ts
import Dexie, { Table } from "dexie";
import ICategory from "../models/category/category.interface";
import { ITask } from "../models/task";
export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  tasks!: Table<ITask>;
  categories!: Table<ICategory>;

  constructor() {
    super("daily");
    this.version(1).stores({
      tasks: "++_id, detail, date, priority", // Primary key and indexed props
      categories: "++_id, title, icon",
    });
  }
}

export const db = new MySubClassedDexie();
