import IEntity from "./entity.interface";

export default interface IApi {
  url: string;
  get(query?: string);
  post(payload: IEntity, query?);
  put(payload: IEntity, query);
  delete(query: string);
}
