import IApi from "../../../core/interfaces/api.interface";
import logger from "../../../utils/logger";
import ITask from "./task.interface";
import axios from "axios";

class TaskApi implements IApi {
  url = process.env.apiurl + "/tasks";

  public async post(payload: ITask, query?) {
    console.log("TaskApi.post()");

    const res = await axios.post(`${this.url}/${query ? query : ""}`, payload);

    if (res.status == 201) {
      const data = res.data;

      return data.data;
    }
  }

  public async put(id: string, task: ITask) {
    console.log("taskApi.put()");

    const res = await axios.put(this.url + "/" + id, task);

    if (res.status == 201) {
      const data = await res.data;

      return data.data;
    }
  }

  public async get(query: string) {
    console.log("taskApi.get()");

    const res = await axios.get(this.url + "/" + query);

    const data = await res.data;
    console.log(data);

    if (res.status == 200) {
      return data.data;
    } else {
      logger.error(res, data.message);
    }
  }
  public async delete(query: string) {
    console.log("taskApi.delete()");

    const res = await axios.delete(this.url + "/" + query);

    if (res.status == 200) {
      return;
    } else {
      logger.error(res);
    }
  }
}

export default new TaskApi();
