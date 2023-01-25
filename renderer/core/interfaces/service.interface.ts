import IEntity from "./entity.interface";

export default interface IService {
  findById(id: string);
  create(payload: IEntity);
  updateById(id: string, payload: IEntity);
  deleteById(id: string);
  deleteMultipleByIds(ids: string[]);
}
