import { pixelPerHour } from "../component/timetables/constant";
import { ITask, taskActions } from "../models/task";
import { TimeInterval } from "../types";

export function getTodayDate(): Date {
  const today = new Date(Date.now());
  today.setHours(0);
  today.setMinutes(0);
  return today;
}

/**
 *
 * @param date
 * @returns "yyyy-mm-dd" formatted today's date string
 */
export function getTodayDateStr(date?): string {
  const todayDate = getTodayDate();
  return getDateStr(todayDate);
}

/**
 * @returns now hour
 */
export function getNowHour(): number {
  return new Date(Date.now()).getHours();
}
/**
 * @returns now minutes
 */
export function getNowMinute() {
  return new Date(Date.now()).getMinutes();
}

export function getMinuteDiffForTimeInterval(timeInterval) {
  const { startTime, endTime } = timeInterval;

  return Math.abs(Number(endTime) - Number(startTime)) / (1000 * 60);
}

export function getPositionFromStartTime(timeInterval: TimeInterval) {
  const startTimeMinute = timeInterval.startTime.getMinutes();
  return Math.round(((startTimeMinute * 1.0) / 60) * pixelPerHour);
}
export function getPositionFromTheDate(date: Date) {
  const minute = date.getMinutes();
  return Math.round(((minute * 1.0) / 60) * pixelPerHour);
}

export function getAbsolutePositionFromDate(date: Date): Number {
  const hr = date.getHours(),
    min = date.getMinutes();
  return hr * pixelPerHour + convertMinuteToPx(min);
}
export function toAppTimeString(date: Date) {
  return date
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    .toLowerCase();
}

export function toHourOnlyString(date: Date) {
  const r = date
    .toLocaleTimeString([], {
      hour: "2-digit",
    })
    .toLowerCase();
  if (r.charAt(0) == "0") {
    return r.slice(1);
  }
  return r;
}

export function roundToIntervalFive(number: number) {
  return Math.round(number / 5) * 5;
}

export function addSeconds(date: Date, seconds: number) {
  date.setSeconds(date.getSeconds() + seconds);
}

export function findOverlappedTask(tasks: ITask[], task: ITask) {
  tasks = tasks.filter((t) => t._id != task._id);

  const taskOverlapped = tasks.find(
    (t) =>
      // taskEndsBetweenComparerInterval(task, t) ||
      taskStartsBetweenComparerInterval(task, t) ||
      taskWrapsTheComparerInterval(task, t)
  );

  return taskOverlapped;
}
export function taskWrapsTheComparerInterval(target: ITask, comparer: ITask) {
  return (
    comparer.timeInterval.startTime >= target.timeInterval.startTime &&
    comparer.timeInterval.endTime <= target.timeInterval.endTime
  );
}

export function taskEndsBetweenComparerInterval(
  target: ITask,
  comparer: ITask
) {
  return (
    comparer.timeInterval.startTime < target.timeInterval.endTime &&
    comparer.timeInterval.endTime >= target.timeInterval.endTime
  );
}
export function taskStartsBetweenComparerInterval(
  target: ITask,
  comparer: ITask
) {
  return (
    comparer.timeInterval.startTime <= target.timeInterval.startTime &&
    comparer.timeInterval.endTime > target.timeInterval.startTime
  );
}

export function adjustIntervalToStartBefore(target: ITask, comparer: ITask) {
  const intervalInMins = getIntervalInMinutes(target.timeInterval);

  let newInterval = { ...target.timeInterval };

  newInterval.endTime = new Date(comparer.timeInterval.startTime);

  newInterval.startTime = new Date(newInterval.endTime);

  newInterval.startTime.setMinutes(
    newInterval.endTime.getMinutes() - intervalInMins
  );

  newInterval.startTime.setSeconds(0);

  return { ...target, timeInterval: newInterval };
}

export function adjustIntervalToStartAfter(target: ITask, comparer: ITask) {
  const intervalInMins = getIntervalInMinutes(target.timeInterval);

  let newInterval = { ...target.timeInterval };

  newInterval.startTime = new Date(comparer.timeInterval.endTime);

  newInterval.endTime = new Date(newInterval.startTime);
  newInterval.endTime.setMinutes(
    newInterval.endTime.getMinutes() + intervalInMins
  );

  newInterval.startTime.setSeconds(0);
  newInterval.endTime.setSeconds(0);

  return { ...target, timeInterval: newInterval };
}

export function getIntervalInMinutes(timeInterval: TimeInterval) {
  const interval =
    timeInterval.endTime.getTime() - timeInterval.startTime.getTime();
  return parseFloat((interval / 60000).toPrecision(100));
}

export function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
  };
}

export function getHeight(el: HTMLDivElement): number {
  return el.clientHeight;
}

export function convertPXtoMinute(px: number) {
  return Math.round(((px * 1.0) / pixelPerHour) * 60);
}
export function convertPXtoSeconds(px: number) {
  return (
    parseFloat(
      (
        parseFloat(((px * 1.0) / pixelPerHour).toPrecision(100)) * 60
      ).toPrecision(100)
    ) * 60
  );
}

export function convertMinuteToPx(minute: number) {
  return Math.round(((minute * 1.0) / 60) * pixelPerHour);
}

export function convertTimeIntervalToPxHeight(timeInterval: TimeInterval) {
  const diffInMinute = getMinuteDiffForTimeInterval(timeInterval);

  return convertMinuteToPx(diffInMinute);
}

const monthMap = {
  1: "January",
  2: "Febuary",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

/**
 *
 * @param date Date object
 */
export function getMonthInStr(date: Date): string {
  const monthNum = date.getMonth() + 1;

  return monthMap[monthNum];
}

const dayMap = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};

/**
 *
 * @param date Date object
 */
export function getDayInStr(date: Date): string {
  const dayNum = date.getDay();

  return dayMap[dayNum];
}

/**
 * @param date
 * @returns "yyyy-mm-dd" formatted date string
 */
export function getDateStr(date: Date) {
  // Get year, month, and day part from the date
  const year = date.toLocaleString("default", { year: "numeric" });
  const month = date.toLocaleString("default", { month: "2-digit" });
  const day = date.toLocaleString("default", { day: "2-digit" });

  // Generate yyyy-mm-dd date string
  const formattedDate = year + "-" + month + "-" + day;

  return formattedDate;
}

/**
 * Gets one week dates (monday - friday).
 * @param date "yyyy-mm-dd" formatted date string
 */
export function getOneWeekDates(date: Date) {
  // 26

  // thursday - 4
  const day = date.getDay();
  const sunday = new Date(date);
  sunday.setDate(sunday.getDate() - date.getDay());
  const dates = [];

  let newDate;
  for (var i = 0; i < 7; i++) {
    let newDate = new Date(sunday);
    newDate.setDate(newDate.getDate() + i);
    dates.push(newDate);
  }

  return dates;
}
