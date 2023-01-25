import pino from "pino";
import PinoPretty from "pino-pretty";

let logger: pino.Logger;

if (process.env.NODE_ENV === "development") {
  logger = pino({ level: "debug" }, PinoPretty());
} else {
  logger = pino({ level: "info" });
}

export default logger;
