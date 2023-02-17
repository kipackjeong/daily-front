import { db } from "../db/localdb";

class AuthLocalService {
  public async getOnlineStatus() {
    const { isOnline } = await db.status.get(1);

    if (isOnline == null) {
      return false;
    }

    return isOnline;
  }
  public async setOnlineStatus(status: boolean) {
    const stat = await db.status.get(1);
    if (!stat) {
      await db.status.add({ isOnline: status });
    } else {
      await db.status.update(1, { isOnline: status });
    }
  }
}

export default new AuthLocalService();
