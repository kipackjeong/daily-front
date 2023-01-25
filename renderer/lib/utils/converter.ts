import { pixelPerHour } from "../component/timetables/constant";
import { TimeInterval } from "../types/time-interval";
import { getMinuteDiffForTimeInterval } from "./helper";

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
export function convertMinuteToPx(minute: number) {
  return Math.round(((minute * 1.0) / 60) * pixelPerHour);
}

export function convertTimeIntervalToPxHeight(timeInterval: TimeInterval) {
  const diffInMinute = getMinuteDiffForTimeInterval(timeInterval);

  return convertMinuteToPx(diffInMinute);
}
