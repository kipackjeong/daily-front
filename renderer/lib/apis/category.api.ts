import IApi from "@core/interfaces/api.interface";
import axiosInstance from "@core/utils/axios";
import logger from "@core/utils/logger";
import { ICategory } from "@lib/models/category";

class CategoryApi implements IApi {
  url = "/categories";

  public async get(options?) {
    logger.info("categoryApi.get()");

    let id, query;
    if (options) {
      id = options.id;
      query = options.query;
    }

    let url = this.url;

    if (id) {
      url += `/${id}`;
    }
    if (query) {
      url += `/${query}`;
    }

    const res = await axiosInstance.get(url);

    if (res.status == 200) {
      return res.data.data;
    } else {
      logger.error(res, res.data.message);
    }
  }
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
