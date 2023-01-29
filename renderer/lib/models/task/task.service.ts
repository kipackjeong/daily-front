import { Dispatch } from "redux";
import logger from "../../../utils/logger";
import taskApi from "./task.api";
import ITask from "./task.interface";
import { taskActions } from "../../redux/slices/task.slice";
import { getDateStr } from "../../utils/helper";

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
  public async createTask(payload: ITask, date, dispatch: Dispatch) {
    logger.info("createTask");

    payload.date = payload.timeInterval.startTime;

    const id = await taskApi.post(payload);
    payload._id = id;

    dispatch(taskActions.addTasks(payload));
  }

  public async updateTask(payload: ITask, dispatch: Dispatch) {
    logger.info("taskService.updateTask()");

    // take out _id prop.
    const { _id, ...updateTask } = payload;

    await taskApi.put(_id, updateTask);

    dispatch(taskActions.updateTask(payload));
  }

  public async refreshTasksByDate(date: Date, dispatch: Dispatch) {
    const dateStr = getDateStr(date);

    let tasks: ITask[] = await taskApi.get(`date/${dateStr}`);

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
    await taskApi.delete(task._id);

    dispatch(taskActions.deleteTask(task._id));
  }

  public async deleteMultipleTasksById(taskIds: string[], dispatch: Dispatch) {
    for (var id of taskIds) {
      await taskApi.delete(id);
    }
    dispatch(taskActions.deleteMultipleTasks(taskIds));

    dispatch(taskActions.resetSelectedTask());
  }
}

export default new TaskService();
