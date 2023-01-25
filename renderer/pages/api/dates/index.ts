import { NextApiRequest, NextApiResponse } from "next";
import DateModel from "../../../lib/models/app-date/app-date.model";
import logger from "../../../utils/logger";

const route = "api/dates";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      await handlePOST(req, res);
    case "GET":
      await handleGET(req, res);
  }
};
/**
 * Gets all the dates.
 * @param req
 * @param res
 */
async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  try {
    logger.info(`Handling GET for ${route} for posted body: ${req.body}.`);

    const dates = await DateModel.find();

    res.status(202).json({ success: true, data: dates });
  } catch (error) {
    res.status(404).json({ message: error });
  }
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  try {
    logger.info(`Handling POST for ${route} for posted body: ${req.body}.`);

    const dates = await DateModel.create(JSON.parse(req.body));

    res.status(201).json({ success: true, data: dates });
  } catch (error) {
    res.status(400).json({ message: error });
  }
}
