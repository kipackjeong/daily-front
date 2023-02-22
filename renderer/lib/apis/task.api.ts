import IApi from "../../../core/interfaces/api.interface";
import logger from "@core/utils/logger";
import ITask from "./task.interface";
import axiosInstance from "@core/utils/axios";

class TaskApi implements IApi {
  url = "/tasks";

  public async get(options?) {
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
    const data = await res.data;

    if (res.status == 200) {
      return data.data;
    } else {
      logger.error(res, data.message);
    }
  }
  public async post(payload: ITask, query?) {
    console.log("TaskApi.post()");

    const res = await axiosInstance.post(
      `${this.url}/${query ? query : ""}`,
      payload
    );

    if (res.status == 201) {
      const data = res.data;

      return data.data;
    }
  }

  public async put(id: string, task: ITask) {
    console.log("taskApi.put()");

    const res = await axiosInstance.put(this.url + "/" + id, task, {});

    if (res.status == 201) {
      const data = await res.data;

      return data.data;
    }
  }

  public async delete(query: string) {
    console.log("taskApi.delete()");

    const res = await axiosInstance.delete(this.url + "/" + query);

    if (res.status == 200) {
      return;
    } else {
      logger.error(res);
    }
  }
}

export default new TaskApi();
