import IApi from "../../../core/interfaces/api.interface";
import logger from "../../../utils/logger";
import IAppDate from "../app-date/app-date.interface";
import ITask from "./task.interface";

class TaskApi implements IApi {
  url = "/api/tasks";

  public async post(payload: ITask, query) {
    console.log("TaskApi.post()");

    const res = await fetch(`${this.url}/${query}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.status == 200) {
      const json = await res.json();
      return json.data;
    }
  }

  public async put(task: ITask) {
    console.log("taskApi.put()");

    const res = await fetch(this.url + "/" + task._id, {
      method: "PUT",
      body: JSON.stringify(task),
    });

    if (res.status == 201) {
      const json = await res.json();
      return json.data;
    }
  }

  public async get(query: string) {
    console.log("taskApi.get()");

    const res = await fetch(this.url + "/" + query, {
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
    console.log("taskApi.delete()");

    const res = await fetch(this.url + "/" + query, {
      method: "DELETE",
    });

    if (res.status == 204) {
      return;
    } else {
      logger.error(res);
    }
  }
}

export default new TaskApi();
