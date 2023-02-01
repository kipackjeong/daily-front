import { IndexableType } from "dexie";
import { db } from "../../localdb/db";
import ICategory from "./category.interface";

class categoryLocalService {
  private db = db;

  public async findAll(): Promise<ICategory[]> {
    return await db.categories.toArray();
  }

  public async create(payload: ICategory): Promise<IndexableType> {
    const key = await db.categories.add(payload);
    return key;
  }
  public async updateById(id, payload): Promise<any> {
    await db.categories.update(id, payload);
  }
  public async delete(id: string) {
    await db.categories.delete(id);
  }
  public async findById(id: string): Promise<ICategory> {
    return await db.categories.get(id);
  }
}
export default new categoryLocalService();
