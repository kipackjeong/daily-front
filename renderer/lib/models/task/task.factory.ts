import ITask from "./task.interface";

export default class TaskFactory {
  public static createEmptyDid(startTime: Date, endTime: Date): ITask {
    return {
      taskType: "Did",
      detail: "",
      focusLevel: 50,
      timeInterval: {
        startTime: startTime,
        endTime: endTime,
      },
    };
  }

  public static createEmptyTodo(startTime: Date, endTime: Date): ITask {
    return {
      taskType: "To Do",
      detail: "",
      focusLevel: 50,
      timeInterval: {
        startTime: startTime,
        endTime: endTime,
      },
    };
  }
}
