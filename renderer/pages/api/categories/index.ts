import CategoryModel from "../../../lib/models/category/category.model";
import connectDB from "../../../lib/middleware/mongodb";
import logger from "../../../utils/logger";
import { NextApiRequest, NextApiResponse } from "next";

export default connectDB(async (req: NextApiRequest, res: NextApiResponse) => {
  const route = "/api/categories";
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        GET();
        break;

      case "POST":
        POST();
        break;

      default:
        throw new Error();
    }

    logger.info(`successfully completed ${req.method} request.`);
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }

  async function GET() {
    logger.info("GET: " + route);
    const categories = await CategoryModel.find(); /* find all the categories */
    res.status(200).json({ success: true, data: categories });
  }
  async function POST() {
    logger.info("POST: " + route);

    const category = await CategoryModel.create(
      JSON.parse(req.body)
    ); /* create a new model in the database */

    await category.save();

    res.status(201).json({ success: true, data: category._id });
  }
});
