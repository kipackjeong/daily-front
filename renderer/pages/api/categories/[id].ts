import CategoryModel from "../../../lib/models/category/category.model";
import connectDB from "../../../lib/middleware/mongodb";
import logger from "../../../utils/logger";
import { NextApiRequest, NextApiResponse } from "next";

export default connectDB(async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const route = `api/categories/${id}`;

  switch (req.method) {
    case "GET":
      GET();
      break;
    case "PUT":
      PUT();
      break;
    case "DELETE":
      DELETE();
      break;
  }

  async function GET() {
    logger.info("GET: " + route);

    try {
      const category = await CategoryModel.findById(id);
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      res.status(400).json({ success: false, message: error });
    }
  }

  async function PUT() {
    logger.info("PUT: " + route);
    try {
      const updatePayload = JSON.parse(req.body);

      await CategoryModel.findByIdAndUpdate(id, updatePayload);

      res.status(204).end();
    } catch (error) {
      res.status(400).json({ success: false, message: error });
    }
  }
  async function DELETE() {
    logger.info("DELETE: " + route);
    try {
      await CategoryModel.findByIdAndDelete(id);

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, message: error });
    }
  }
});
