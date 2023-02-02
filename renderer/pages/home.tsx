import React from "react";
import PageLayout from "../core/layouts/PageLayout";
import DailyBoard from "../lib/component/dailyboard";

function home() {
  return (
    // <PageLayout>
    //   <DashBoard />
    // </PageLayout>
    <PageLayout>
      <DailyBoard />
    </PageLayout>
  );
}
export default home;
