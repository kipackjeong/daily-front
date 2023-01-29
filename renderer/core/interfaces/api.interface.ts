import IEntity from "./entity.interface";

export default interface IApi {
  url: string;
  get(query?: string);
  post(payload: IEntity, query?);
  put(id: string, payload: IEntity, query);
  delete(query: string);
}
