/**
 * Checks app's status
 */
import axios from "axios";
import { useEffect, useState } from "react";
import { singletonHook } from "react-singleton-hook";
import { db } from "../db/localdb";

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
        const res = await axios.get(process.env.apiurl);
        setIsOnline(true);
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
