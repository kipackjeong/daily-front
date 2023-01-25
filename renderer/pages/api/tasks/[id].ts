import { NextApiRequest, NextApiResponse } from "next";
import { handleWebpackExtenalForEdgeRuntime } from "next/dist/build/webpack/plugins/middleware-plugin";
import { ITask, TaskModel } from "../../../lib/models/task";
import logger from "../../../utils/logger";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const route = "api/tasks/[id]";
  const { method, query, body } = req;
  const { id } = req.query;

  logger.info(route);

  try {
    switch (method) {
      case "GET":
        handleGET();
        break;
      case "PUT":
        handlePUT();
        break;
      case "DELETE":
        handleDELETE();
        break;
    }

    return;
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }

  async function handleGET() {
    logger.info("GET: " + route);
    logger.info("- taskIdToGet: " + id);

    const task = await TaskModel.findById(id).populate("category");
    console.log(task);

    res.status(200).json({ success: true, data: task });
  }
  async function handlePUT() {
    logger.info("PUT: " + route);
    logger.info("- taskIdToUpdate: " + id);

    const taskToUpdate: ITask = JSON.parse(req.body);

    await TaskModel.findByIdAndUpdate(id, taskToUpdate);

    const updatedTask = await TaskModel.findById(id);

    // logger.info("- updatedTask: ");
    // logger.info(updatedTask);

    res.status(204).end();
  }

  async function handleDELETE() {
    logger.info("DELETE: " + route);
    logger.info("- taskIdToDelete: " + id);

    await TaskModel.findByIdAndDelete(id);

    res.status(204).end();
  }
};
