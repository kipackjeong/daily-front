import mongoose, { isValidObjectId } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import DateModel from "../../../../lib/models/app-date/app-date.model";
import ITask from "../../../../lib/models/task/task.interface";
import TaskModel from "../../../../lib/models/task/task.model";
import logger from "../../../../utils/logger";

interface Request extends NextApiRequest {
  query: {
    dateId: string;
  };
}

export default async (req: Request, res: NextApiResponse) => {
  const route = "api/tasks/dates/[dateId]";

  try {
    switch (req.method) {
      case "POST":
        await handlePOST();
        break;
      case "GET":
        await handleGET();
        break;
    }
  } catch (error) {
    logger.info(error);
    res.status(400).json({ success: false });
  }

  async function handlePOST() {
    logger.info("POST: " + route);

    const dateId = req.query.dateId;
    const taskToCreate: ITask = JSON.parse(req.body);
    logger.info("- taskToCreate: ");
    logger.info(taskToCreate);

    const date = await DateModel.findById(new mongoose.Types.ObjectId(dateId));

    if (!date) {
      res.status(404).json({
        success: false,
        message: "Cannot find the date with id: " + dateId,
      });
    }

    taskToCreate.date = new mongoose.Types.ObjectId(dateId);
    const createdTask = await TaskModel.create(taskToCreate);

    res.status(200).json({ success: true, data: createdTask.id });
  }
  async function handleGET() {
    logger.info("GET: " + route);

    const dateId = req.query.dateId;

    const tasks = await TaskModel.find({ date: dateId }).populate("category");

    if (!tasks) {
      res.status(404).json({
        success: false,
        message: "Cannot find the date with id: " + dateId,
      });
    }

    logger.info("--result: ");

    res.status(200).json({ success: true, data: tasks });
  }
};
