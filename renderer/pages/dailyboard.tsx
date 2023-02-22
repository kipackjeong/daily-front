import PageLayout from "@core/layouts/PageLayout";
import Auth from "@lib/components/Auth";
import DailyBoard from "@lib/components/Dailyboard";
import SideBar from "@lib/components/nav/SideBar";

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
