/**
 * Checks app's status
 */
import axios from "axios";
import { useEffect, useState } from "react";
import { singletonHook } from "react-singleton-hook";
import { db } from "../localdb/db";

const isOnline = null;

const initSetting = {
  isOnline,
};

export const useAppStatus = singletonHook(initSetting, () => {
  console.log("useAppStatus");

  const [isOnline, setIsOnline] = useState(initSetting.isOnline);

  useEffect(() => {
    async function checkConnectionWithAPI() {
      try {
        const res = await axios.get(process.env.apiurl);
        console.log("res: ");
        console.log(res);
        setIsOnline(true);
      } catch (error) {
        console.log("error: " + error);
        db.open();
        setIsOnline(false);
      }
    }

    checkConnectionWithAPI();
  }, []);

  return { isOnline };
});
