import PageLayout from "../core/layouts/PageLayout";
import DailyBoard from "../lib/component/dailyboard";
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
    <PageLayout>
      <DailyBoard />
    </PageLayout>
  );
};

export default dailyBoard;
