import { Dispatch } from "redux";
import logger from "../../../utils/logger";
import { IAppDate } from "../app-date";
import taskApi from "./task.api";
import ITask from "./task.interface";
import { taskActions } from "./task.slice";

class TaskService {
  public async getById(id: string, dispatch?: Dispatch) {
    logger.info("taskService.getById()");
    const task = await taskApi.get(id);
    logger.info(task);

    task.timeInterval.startTime = new Date(task.timeInterval.startTime);
    task.timeInterval.endTime = new Date(task.timeInterval.endTime);

    logger.info(task);

    return task;
  }
  public async createTask(payload: ITask, date: IAppDate, dispatch: Dispatch) {
    logger.info("createTask");

    const query = `dates/${date.id}`;

    const id = await taskApi.post(payload, query);

    payload._id = id;

    dispatch(taskActions.addTasks(payload));
  }

  public async updateTask(payload: ITask, dispatch: Dispatch) {
    logger.info("taskService.updateTask()");

    if (payload._id) {
      await taskApi.put(payload);
    }

    dispatch(taskActions.updateTask(payload));
  }

  public async refreshTasksByDate(date: IAppDate, dispatch: Dispatch) {
    let tasks: ITask[] = await taskApi.get(`dates/${date.id}`);

    if (!tasks) {
      tasks = [];
    }
    tasks.map((task) => {
      task.timeInterval.startTime = new Date(task.timeInterval.startTime);
      task.timeInterval.endTime = new Date(task.timeInterval.endTime);
    });

    dispatch(taskActions.setTasks(tasks));
  }

  public async deleteTask(task: ITask, dispatch: Dispatch) {
    await taskApi.delete("/" + task._id);
    dispatch(taskActions.deleteTask(task._id));
  }

  public async deleteMultipleTasksById(taskIds: string[], dispatch: Dispatch) {
    for (var id of taskIds) {
      await taskApi.delete("/" + id);
    }
    dispatch(taskActions.deleteMultipleTasks(taskIds));

    dispatch(taskActions.resetSelectedTask());
  }
}

export default new TaskService();
