/**
 * Checks app's status
 */
import axios from "axios";
import { useEffect, useState } from "react";
import { singletonHook } from "react-singleton-hook";
import { db } from "../db/localdb";
import authLocalService from "@lib/services/auth/auth.local-service";

const isOnline = null;

const initSetting = {
  isOnline,
  setIsOnline: () => {},
};
export const useAppStatus = singletonHook(initSetting, () => {
  const [isOnline, setIsOnline] = useState(initSetting.isOnline);

  useEffect(() => {
    async function checkConnectionWithAPI() {
      try {
        const isOnline = await authLocalService.getOnlineStatus();

        if (isOnline) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      } catch (error) {
        console.log("error: " + error);
        db.open();
        setIsOnline(false);
      }
    }

    checkConnectionWithAPI();
  }, []);

  return { isOnline, setIsOnline };
});
