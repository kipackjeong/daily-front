export type { default as ITask } from "./task.interface";
export { default as taskApi } from "./task.api";
export { default as taskService } from "./task.service";
export {
  taskActions,
  selectSelectedTasks,
  selectTasks,
} from "../../redux/slices/task.slice";
