import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import FullPageSpinner from "../core/components/FullPageSpinner";
import { useAppStatus } from "../lib/hooks/useAppStatus";
import { taskActions } from "../lib/models/task";
import { userActions } from "../lib/redux/slices/user.slice";
import axiosInstance from "../lib/utils/axios";

const logout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { setIsOnline } = useAppStatus();

  useEffect(() => {
    async function logout() {
      try {
        setIsOnline(false);
        dispatch(taskActions.deleteAll());
        dispatch(userActions.setUser(null));

        await axiosInstance.post("/logout");
      } catch (error) {}
      router.push("/login");
    }

    logout();
  }, []);

  return <FullPageSpinner />;
};

export default logout;
