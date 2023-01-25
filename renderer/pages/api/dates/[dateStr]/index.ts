import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import DateModel from "../../../../lib/models/app-date/app-date.model";
import connectDB from "../../../../lib/middleware/mongodb";
import logger from "../../../../utils/logger";

export default connectDB(async (req: NextApiRequest, res: NextApiResponse) => {
  const route = "api/dates/:dateStr";

  try {
    switch (req.method) {
      case "POST":
      // await handlePOST(req, res);
      case "GET":
        await handleGET();
    }
  } catch (error) {
    res.status(400).json({ success: false });
  }

  /**
   * Gets all the dates.
   * @param req
   * @param res
   */
  async function handleGET() {
    logger.info("GET " + route);
    logger.info("--query: " + JSON.stringify(req.query));
    logger.info("--payload: " + req.body);

    const receivedDate = new Date(req.query.dateStr as string);

    const y = receivedDate.getUTCFullYear();
    const m = receivedDate.getUTCMonth();
    const d = receivedDate.getUTCDate();

    const day = receivedDate.getUTCDay();

    const oneDayInMS = 86400000;

    const daysBackTillMonday = day * oneDayInMS;

    const mondayDate = new Date(receivedDate.getTime() - daysBackTillMonday);

    // saturday's date
    const lastDateOfWeek = d - day + 7;

    const dates = [];

    let date: mongoose.Document<unknown, any, Date>;
    let newDate: Date;
    for (var i = 0; i < 7; i++) {
      const dayInMS = i * oneDayInMS;

      newDate = new Date(mondayDate.getTime() + dayInMS);

      try {
        [date] = await DateModel.find({
          year: newDate.getUTCFullYear(),
          month: newDate.getUTCMonth(),
          date: newDate.getUTCDate(),
          day: i,
        }).populate("tasks");

        if (!date) {
          date = await DateModel.create({
            year: newDate.getUTCFullYear(),
            month: newDate.getUTCMonth(),
            date: newDate.getUTCDate(),
            day: i,
          });

          await date.save();
        }
        
      } catch (error) {
        logger.info(error);
      }
      dates.push(date);
    }

    res.status(200).json({ success: true, data: dates });
  }
});

// async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     logger.info(`Handling POST for ${route} for posted body: ${req.body}.`);

//     const dates = await DateModel.create(JSON.parse(req.body));

//     res.status(201).json({ success: true, data: dates });
//   } catch (error) {
//     res.status(400).json({ message: error });
//   }
//
