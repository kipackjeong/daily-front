import ITask from "../task/task.interface";

export default interface IAppDate {
  id?: string;
  year: number;
  month: number;
  date: number;
  day: number;
  tasks: ITask[];
  getDayInStr(): string;
  getMonthInStr(): string;
  getDateStr(): string;
}
