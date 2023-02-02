import router from "next/router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import PageLayout from "../core/layouts/PageLayout";
import Auth from "../lib/component/Auth";
import DailyBoard from "../lib/component/Dailyboard";
import SideBar from "../lib/component/task/TaskForm/atoms/nav/SideBar";
import { userActions } from "../lib/redux/slices/user.slice";
import axiosInstance from "../lib/utils/axios";

function home() {
  return (
    // <PageLayout>
    //   <DashBoard />
    // </PageLayout>
    <Auth>
      <SideBar />
      <PageLayout>
        <DailyBoard />
      </PageLayout>
    </Auth>
  );
}
export default home;
