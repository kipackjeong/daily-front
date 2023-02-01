import { Dispatch } from "redux";
import logger from "../../../utils/logger";
import taskApi from "./task.api";
import ITask from "./task.interface";
import { taskActions } from "../../redux/slices/task.slice";
import { getDateStr } from "../../utils/helper";

class TaskService {
  public async findById(id: string, dispatch?: Dispatch) {
    logger.info("isOnline ? taskService.findById()");
    const task = await taskApi.get(id);

    task.timeInterval.startTime = new Date(task.timeInterval.startTime);
    task.timeInterval.endTime = new Date(task.timeInterval.endTime);

    return task;
  }

  public async create(payload: ITask, dispatch: Dispatch) {
    logger.info("create");

    payload.timeInterval.startTime.setSeconds(0);
    payload.timeInterval.endTime.setSeconds(0);

    payload.date = payload.timeInterval.startTime;

    const id = await taskApi.post(payload);
    payload._id = id;

    dispatch(taskActions.addTasks(payload));
  }

  public async update(payload: ITask, dispatch: Dispatch) {
    logger.info("isOnline ? taskService.update()");

    payload.timeInterval.startTime.setSeconds(0);
    payload.timeInterval.endTime.setSeconds(0);

    // take out _id prop.
    const { _id, ...updateTask } = payload;

    await taskApi.put(_id, updateTask);

    dispatch(taskActions.updateTask(payload));
  }

  public async refreshTasksByDate(date: Date, dispatch: Dispatch) {
    const dateStr = getDateStr(date);

    let tasks: ITask[];
    tasks = await taskApi.get(`date/${dateStr}`);

    // try {
    // } catch (error) {
    //   console.log("api not connected");
    //   tasks = await taskLocalService.getAllTasks();
    // }

    if (!tasks) {
      tasks = [];
    }

    tasks.map((task) => {
      task.timeInterval.startTime = new Date(task.timeInterval.startTime);
      task.timeInterval.endTime = new Date(task.timeInterval.endTime);
    });

    dispatch(taskActions.setTasks(tasks));
  }

  public async delete(task: ITask, dispatch: Dispatch) {
    await taskApi.delete(task._id);

    dispatch(taskActions.deleteTask(task._id));
  }

  public async deleteMultipleTasks(taskIds: string[], dispatch: Dispatch) {
    for (var id of taskIds) {
      await taskApi.delete(id);
    }
    dispatch(taskActions.deleteMultipleTasks(taskIds));

    dispatch(taskActions.resetSelectedTask());
  }
}

export default new TaskService();
