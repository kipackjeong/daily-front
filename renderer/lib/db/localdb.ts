// db.ts
import Dexie, { Table } from "dexie";
import { ITask } from "@lib/models/task";
import { ICategory } from "@lib/models/category";
export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  tasks!: Table<ITask>;
  categories!: Table<ICategory>;
  status: Table;

  constructor() {
    super("daily");
    this.version(1).stores({
      tasks: "++_id, detail, date, priority", // Primary key and indexed props
      categories: "++_id, title, icon",
      status: "++_id, isOnline",
    });
  }
}

export const db = new MySubClassedDexie();
