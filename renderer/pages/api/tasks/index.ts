import connectDB from "../../../lib/middleware/mongodb";
import { TaskModel } from "../../../lib/models/task";
import logger from "../../../utils/logger";

// "/api/tasks"

export default connectDB(async (req, res) => {
  const route = "/api/tasks";

  const { method } = req;

  try {
    switch (method) {
      case "GET":
        get();
        break;

      case "POST":
        post();
        break;

      default:
        res
          .status(400)
          .json({ success: false, message: "Unavailable request method." });
        break;
    }
  } catch (error) {
    logger.error(error);

    res.status(400).json({ success: false, message: "Server Error." });
  }

  async function get() {
    logger.info("GET: " + route);
    const tasks = await TaskModel.find();
    res.status(200).json({ success: true, data: tasks });
  }
  async function post() {
    logger.info("POST: " + route);
    const task = await TaskModel.create(JSON.parse(req.body));

    task.save();
    res.status(201).json({ success: true, data: task.id });
  }
});
