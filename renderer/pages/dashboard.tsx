import React from "react";
import PageLayout from "../core/layouts/PageLayout";
import DashBoard from "../lib/component/dashboard";

function dashBoard() {
  return (
    <PageLayout>
      <DashBoard />
    </PageLayout> 
  );
}

// dashBoard.getInitialProps = async (ctx) => {
//   console.log("dashboard/[dateStr]/ - getInitialProps");
// };
export default dashBoard;
