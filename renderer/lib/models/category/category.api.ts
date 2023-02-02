import IApi from "../../../core/interfaces/api.interface";
import logger from "../../../utils/logger";
import axiosInstance from "../../utils/axios";
import ICategory from "./category.interface";

class CategoryApi implements IApi {
  url = "/categories";

  public async post(payload: ICategory) {
    logger.info("categoryApi.post()");

    const res = await axiosInstance.post(this.url, payload);

    if (res.status == 201) {
      const data = res.data;
      return data.data;
    }
  }

  public async put(id: string, payload: ICategory, query?) {
    logger.info("categoryApi.put()");

    const res = await axiosInstance.put(this.url + "/" + id, payload);

    if (res.status == 201) {
      return;
    } else {
      logger.error(res);
    }
  }

  public async get(query?: string) {
    logger.info("categoryApi.get()");
    let url = this.url;

    if (query) {
      url += "/" + query;
    }

    const res = await axiosInstance.get(url);

    if (res.status == 200) {
      return res.data.data;
    } else {
      logger.error(res, res.data.message);
    }
  }

  public async delete(query: string) {
    logger.info("categoryApi.delete()");

    const res = await axiosInstance.delete(this.url + "/" + query);

    if (res.status == 200) {
      return res.data.data;
    } else {
      logger.error(res, res.data.message);
    }
  }
}

export default new CategoryApi();
