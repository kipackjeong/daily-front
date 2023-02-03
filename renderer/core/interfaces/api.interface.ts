import IEntity from "./entity.interface";

export default interface IApi {
  url: string;
  get(options?);
  post(payload: IEntity, query?);
  put(id: string, payload: IEntity, query);
  delete(query: string);
}
