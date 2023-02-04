import { Dispatch } from "redux";
import logger from "../../../utils/logger";
import taskApi from "./task.api";
import ITask from "./task.interface";
import { taskActions } from "../../redux/slices/task.slice";
import { getDateStr } from "../../utils/helper";
import { ServiceErrorHandler } from "../../utils/decorators";

class TaskService {
  @ServiceErrorHandler
  public async findNextTodos() {
    let tasks = await taskApi.get({ query: `?after=${new Date()}` });

    tasks = this.populateTimeIntervalForTasks(tasks);

    return tasks;
  }
  @ServiceErrorHandler
  public async findTopNByPriorityDescOrder(n: number) {
    let tasks = await taskApi.get({ query: `?sort=priority&top=${n}` });

    tasks = this.populateTimeIntervalForTasks(tasks);

    return tasks;
  }
  @ServiceErrorHandler
  public async findById(id: string, dispatch?: Dispatch) {
    logger.info("isOnline ? taskService.findById()");
    let task = await taskApi.get({ id });

    task = this.populateTimeIntervalForTask(task);

    return task;
  }
  @ServiceErrorHandler
  public async findTasksByDate(date: Date, dispatch: Dispatch) {
    const dateStr = getDateStr(date);

    let tasks: ITask[];
    tasks = await taskApi.get({ query: `date/${dateStr}` });

    // try {
    // } catch (error) {
    //   console.log("api not connected");
    //   tasks = await taskLocalService.getAllTasks();
    // }

    if (!tasks) {
      tasks = [];
    }

    tasks = this.populateTimeIntervalForTasks(tasks);

    dispatch(taskActions.setTasks(tasks));
  }
  @ServiceErrorHandler
  public async create(payload: ITask, dispatch: Dispatch) {
    logger.info("create");

    payload.timeInterval.startTime.setSeconds(0);
    payload.timeInterval.endTime.setSeconds(0);

    payload.date = payload.timeInterval.startTime;

    const id = await taskApi.post(payload);
    payload._id = id;

    dispatch(taskActions.addTasks(payload));
  }
  @ServiceErrorHandler
  public async update(payload: ITask, dispatch: Dispatch) {
    logger.info("isOnline ? taskService.update()");

    payload.timeInterval.startTime.setSeconds(0);
    payload.timeInterval.endTime.setSeconds(0);

    // take out _id prop.
    const { _id, ...updateTask } = payload;

    await taskApi.put(_id, updateTask);

    dispatch(taskActions.updateTask(payload));
  }
  @ServiceErrorHandler
  public async delete(task: ITask, dispatch: Dispatch) {
    await taskApi.delete(task._id);

    dispatch(taskActions.deleteTask(task._id));
  }
  @ServiceErrorHandler
  public async deleteMultipleTasks(taskIds: string[], dispatch: Dispatch) {
    for (var id of taskIds) {
      await taskApi.delete(id);
    }
    dispatch(taskActions.deleteMultipleTasks(taskIds));

    dispatch(taskActions.resetSelectedTask());
  }
  private populateTimeIntervalForTask(task: ITask) {
    task.timeInterval.startTime = new Date(task.timeInterval.startTime);
    task.timeInterval.endTime = new Date(task.timeInterval.endTime);
    return task;
  }
  private populateTimeIntervalForTasks(tasks: ITask[]) {
    tasks.map((t) => {
      return this.populateTimeIntervalForTask(t);
    });
    return tasks;
  }
}

export default new TaskService();
