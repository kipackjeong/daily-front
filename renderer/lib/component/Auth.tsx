import Router from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FullPageSpinner from "../../core/components/FullPageSpinner";
import { useAppStatus } from "../hooks/useAppStatus";
import { selectUser, userActions } from "../redux/slices/user.slice";
import axiosInstance from "../utils/axios";

const Auth = ({ children }) => {
  const user = useSelector(selectUser);
  const router = Router;

  const { isOnline } = useAppStatus();

  const dispatch = useDispatch();
  // needed incase of user reloading the app.
  useEffect(() => {
    console.log("isOnline: " + isOnline);

    if (!user && isOnline) {
      callApiToGetUser();
    }

    async function callApiToGetUser() {
      try {
        const res = await axiosInstance.get("/users/user");
        const user = res.data.data;

        // browser has user auth token.
        dispatch(userActions.setUser(user));
        router.push("/home");
      } catch (error) {
        // browser don't have user auth token or is expired.
        console.log("No Authorization token cookie on the browser");
        router.push("/login");
      }
    }
  }, [user, isOnline]);

  return user || !isOnline ? <>{children}</> : <FullPageSpinner />;
};

export default Auth;
