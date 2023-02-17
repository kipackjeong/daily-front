import { Dispatch } from "@reduxjs/toolkit";
import IApi from "../../core/interfaces/api.interface";
import IEntity from "../../core/interfaces/entity.interface";
import { ITask } from "../models/task";

export default interface IService {
  api: IApi;
  findById(payload: IEntity, dispatch: Dispatch);
  create(payload: IEntity, dispatch: Dispatch);
  update(payload: IEntity, dispatch: Dispatch);
  delete(payload: IEntity, dispatch: Dispatch);
}
