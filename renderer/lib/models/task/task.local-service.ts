import { Dispatch } from "@reduxjs/toolkit";
import { IndexableType } from "dexie";
import { db } from "../../db/localdb";
import { taskActions } from "../../redux/slices/task.slice";
import ITask from "./task.interface";
class TaskLocalService {
  private db = db;
  public async findTopNByPriorityDescOrder(n: number) {
    let tasks = await this.db.tasks
      .where("taskType")
      .equals("To Do")
      .sortBy("priority");
    tasks = tasks.slice(0, 5);

    return tasks;
  }
  public async findAll(): Promise<ITask[]> {
    await db.open();
    return await db.tasks.toArray();
  }
  public async findAllByDate(dateStr: string | Date, dispatch: Dispatch) {
    await db.open();
    const s = new Date(dateStr);
    const e = new Date(dateStr);

    s.setMinutes(1);
    s.setHours(0);

    e.setMinutes(59);
    e.setHours(23);
    console.log("s: " + s);
    console.log("e: " + e);

    const tasks = await db.tasks.where("date").between(s, e).toArray();
    console.log("tasks: ");
    console.log(tasks);
    tasks.map((task) => {
      task.timeInterval.startTime = new Date(task.timeInterval.startTime);
      task.timeInterval.endTime = new Date(task.timeInterval.endTime);
    });

    dispatch(taskActions.setTasks(tasks));
  }
  public async create(
    payload: ITask,
    dispatch: Dispatch
  ): Promise<IndexableType> {
    console.log("creating task in local");
    payload.date = payload.timeInterval.startTime;
    await db.open();

    const key = await db.tasks.add(payload);
    payload._id = key as string;

    console.log("payload: ");
    console.log(payload);

    dispatch(taskActions.addTasks(payload));
    return key;
  }

  public async delete(id: string, dispatch: Dispatch) {
    await db.open();
    await db.tasks.delete(id);
    dispatch(taskActions.deleteTask(id));
  }
  public async deleteMultipleTasks(ids: string[], dispatch) {
    await db.open();
    for (var id of ids) {
      await db.tasks.delete(id);
    }

    dispatch(taskActions.deleteMultipleTasks(ids));
    dispatch(taskActions.resetSelectedTask());
  }
  public async update(payload: ITask, dispatch: Dispatch) {
    await db.open();
    dispatch(taskActions.updateTask(payload));
    await db.tasks.update(payload._id, payload);
  }
}

export default new TaskLocalService();
