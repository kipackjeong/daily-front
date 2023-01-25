import { Dispatch } from "react";
import IService from "../../../core/interfaces/service.interface";
import { getTodayDate, getTodayDateStr } from "../../utils/helper";
import appDateApi from "./app-date.api";
import AppDate from "./app-date.class";
import IAppDate from "./app-date.interface";
import { setDates, setSelectedDate } from "./app-date.slice";

class AppDateService implements IService {
  public async findById(id: string) {
    return await appDateApi.get(id);
  }
  public async findByDateStr(dateStr: string, dispatch) {
    const dates = await appDateApi.get(dateStr);
    const appDates = this.convertToAppDate(dates);
    const selectedDate = this.getSelectedDate(appDates, dateStr);
    dispatch(setDates(appDates));
    dispatch(setSelectedDate(selectedDate));
  }

  public async findToday(dispatch): Promise<IAppDate> {
    const todayDateStr = getTodayDateStr();

    // in pure object.
    const dates = await appDateApi.get(todayDateStr);

    const appDates = this.convertToAppDate(dates);

    dispatch(setDates(appDates));
    return this.getTodayDate(appDates);
  }

  public async findTodayThenSelect(dispatch): Promise<IAppDate> {
    const todayAppDate = await this.findToday(dispatch);
    dispatch(setSelectedDate(todayAppDate));

    return todayAppDate;
  }

  public async create(payload: IAppDate) {
    return await appDateApi.post(payload);
  }
  public async updateById(id: string, payload: IAppDate) {
    return await appDateApi.put(payload, id);
  }
  public async deleteById(id: string) {
    return await appDateApi.delete(id);
  }
  public async deleteMultipleByIds(ids: string[]) {
    for (var id in ids) {
      await appDateApi.delete(id);
    }
  }

  private getTodayDate(dates: IAppDate[]) {
    let initialDateToScope;

    const todayDate = getTodayDate();

    dates.forEach((d) => {
      if (d.date == todayDate.getDate()) {
        initialDateToScope = d;
      }
    });

    if (!initialDateToScope) {
      initialDateToScope = dates[0];
    }
    return initialDateToScope;
  }

  private getSelectedDate(dates: IAppDate[], dateStr: string) {
    let initialDateToScope;

    dates.forEach((d) => {
      if (d.getDateStr() == dateStr) {
        initialDateToScope = d;
      }
    });

    if (!initialDateToScope) {
      initialDateToScope = dates[0];
    }
    return initialDateToScope;
  }

  private convertToAppDate(dates) {
    // convert pure objects to AppDate instances.
    const appDates: AppDate[] = dates.map((rd) => {
      const convertedDate = new AppDate(
        rd.id,
        rd.year,
        rd.month,
        rd.date,
        rd.day
      );

      return convertedDate;
    });

    return appDates;
  }
}

export default new AppDateService();
