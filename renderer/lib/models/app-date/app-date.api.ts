import AppDate from "./app-date.class";
import IAppDate from "./app-date.interface";

class AppDateApi {
  private url = "/api/dates";

  constructor() {}

  public async get(query?: string): Promise<any[]> {
    console.log("appDateApi.get()");

    const res = await fetch(this.url + "/" + query, {
      method: "GET",
    });

    const json = await res.json();
    const dates = json.data;

    return dates;
  }
  public async post(payload: IAppDate) {
    const res = await fetch(this.url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async put(payload: IAppDate, id: string): Promise<void> {
    const res = await fetch("/api/daily-board/dates/" + id, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }
  public async delete(id: string): Promise<void> {
    const res = await fetch("/api/daily-board/dates/" + id, {
      method: "DELETE",
    });
  }
}

export default new AppDateApi();
