import { toPrecision } from "../../utils/helper";

export const pixelPerHour = 160;

export const pixelPerMinute = toPrecision((pixelPerHour * 1.0) / 60, 100);
