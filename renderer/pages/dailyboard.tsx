import electron from "electron";
import { useEffect, useState } from "react";
import PageLayout from "../core/layouts/PageLayout";
import Auth from "../lib/component/Auth";
import DailyBoard from "../lib/component/Dailyboard";
import SideBar from "../lib/component/task/TaskForm/atoms/nav/SideBar";
import { appStoreWrapper } from "../lib/redux/stores/app.store";

const dailyBoard = () => {
  // TODO: implement polling to call PUT/POST request for tasks every x min, if there was a change.
  // usePollingEffect(
  //   async () => {
  //     // update tasks.
  //     console.log("polling");

  //   },
  //   [],
  //   { interval: 5000 }
  // );

  return (
    <Auth>
      <SideBar />

      <PageLayout>
        <DailyBoard />
      </PageLayout>
    </Auth>
  );
};

export default dailyBoard;
