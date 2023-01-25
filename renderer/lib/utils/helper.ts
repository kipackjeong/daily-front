import { pixelPerHour } from "../component/timetables/constant";
import { IAppDate } from "../models/app-date";
import { TimeInterval } from "../types";
import { convertMinuteToPx } from "./converter";

export function getTodayDate(): Date {
  return new Date(Date.now());
}

export function getTodayDateStr(date?: IAppDate): string {
  const todayDate = getTodayDate();
  const yyyy = todayDate.getFullYear();
  const mm = todayDate.getMonth() + 1;
  const dd = todayDate.getDate();

  return `${yyyy}-${mm}-${dd}`;
}

export function getNowHour() {
  return new Date(Date.now()).getHours();
}

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
