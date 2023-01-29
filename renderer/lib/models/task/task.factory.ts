import ITask from "./task.interface";

export default class TaskFactory {
  public static createEmptyDid(startTime: Date, endTime: Date): ITask {
    return {
      taskType: "DID",
      title: "",
      focusLevel: 50,
      timeInterval: {
        startTime: startTime,
        endTime: endTime,
      },
    };
  }
  
  public static createEmptyTodo(startTime: Date, endTime: Date): ITask {
    return {
      taskType: "TODO",
      title: "",
      focusLevel: 50,
      timeInterval: {
        startTime: startTime,
        endTime: endTime,
      },
    };
  }
}
