import IEntity from "../../../core/interfaces/entity.interface";

export default interface ICategory extends IEntity {
  _id?: string;
  title: string;
  icon: string;
  totalTimeSpent?: number;
  averageFocusLevel?: number;
}
