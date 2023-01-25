import { monthsMap, daysMap } from "./app-date.model";
import IAppDate from "./app-date.interface";
import ITask from "../task/task.interface";

class AppDate implements IAppDate {
  public id?: string;
  public year: number;
  public month: number;
  public date: number;
  public day: number;
  public tasks: ITask[];

  /**
   *
   */
  constructor(id, year, month, date, day, tasks = null) {
    this.id = id;
    this.setYear(year);
    this.setMonth(month);
    this.setDate(date);
    this.setDay(day);
    this.tasks = tasks;
  }
  public setYear(year: number) {
    this.year = year;
  }
  public setMonth(month: string | number) {
    if (typeof month == "string") {
      this.month = monthsMap[month];
    } else {
      this.month = month;
    }
  }
  public getMonthInStr() {
    return Object.keys(monthsMap)[this.month];
  }
  public setDate(date: number) {
    this.date = date;
    this.regenDate();
  }

  public setDay(day: string | number) {
    if (typeof day === "string") {
      this.day = daysMap[day];
    } else {
      this.day = day;
    }
  }

  public getDayInStr(): string {
    return Object.keys(daysMap)[this.day];
  }

  public getDateStr(): string {
    return `${this.year}-${this.month + 1}-${this.date}`;
  }

  private regenDate() {
    if (this.day < 29) {
      return;
    }

    let daysInMonth;
    const isLeapYear = this.year % 4 == 0;
    // Jan, March, May, July, Aug, October, Dec => 31 days
    if (
      (this.month < 7 && this.month % 2 == 0) ||
      (this.month > 6 && this.month % 2 == 1)
    ) {
      daysInMonth = 31;
    }

    // Feb => 28 | 29 days
    else if (this.month == 1) {
      daysInMonth = isLeapYear ? 29 : 28;
    }

    // April, June, Sep, Nov => 30 days
    else {
      daysInMonth = 30;
    }

    if (this.date > daysInMonth) {
      this.month++;
      this.date = this.date - daysInMonth;
    }
  }
}

export default AppDate;
