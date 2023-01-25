import IApi from "../../../core/interfaces/api.interface";
import logger from "../../../utils/logger";
import ICategory from "./category.interface";

class CategoryApi implements IApi {
  url = "http://localhost:8888/api/categories";

  public async post(payload: ICategory) {
    logger.info("categoryApi.post()");

    const res = await fetch(this.url, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.status == 201) {
      const json = await res.json();
      return json.data;
    }
  }

  public async put(payload: ICategory, id: string) {
    logger.info("categoryApi.put()");

    const res = await fetch(this.url + "/" + id, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (res.status == 204) {
      return;
    } else {
      const json = await res.json();
      logger.error(res, json.message);
    }
  }

  public async get(query?: string) {
    logger.info("categoryApi.get()");
    let url = this.url;

    if (query) {
      url += "/" + query;
    }

    const res = await fetch(url, {
      method: "GET",
    });

    const json = await res.json();

    if (res.status == 200) {
      return json.data;
    } else {
      logger.error(res, json.message);
    }
  }

  public async delete(query: string) {
    logger.info("categoryApi.delete()");

    const res = await fetch(this.url + "/" + query, {
      method: "DELETE",
    });

    const json = await res.json();

    if (res.status == 200) {
      return json.data;
    } else {
      logger.error(res, json.message);
    }
  }
}

export default new CategoryApi();
