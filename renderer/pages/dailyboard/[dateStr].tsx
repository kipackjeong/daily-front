import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageLayout from "../../core/layouts/PageLayout";
import DailyBoard from "../../lib/component/dailyboard";
import appDateService from "../../lib/models/app-date/app-date.service";
import {
  selectDates,
  selectSelectedDate,
} from "../../lib/models/app-date/app-date.slice";
import { taskService } from "../../lib/models/task";

const dailyBoard = ({ dateStr }) => {
  console.log("DailyBoardPage renders");

  // TODO: implement polling to call PUT/POST request for tasks every x min, if there was a change.
  // usePollingEffect(
  //   async () => {
  //     // update tasks.
  //     console.log("polling");

  //   },
  //   [],
  //   { interval: 5000 }
  // );

  //#region Hooks

  //#region Effects

  //#endregion

  //#region Memos

  //#endregion

  //#region Handlers

  //#endregion

  return (
    <PageLayout>
      <DailyBoard dateStr={dateStr} />
    </PageLayout>
  );
};

dailyBoard.getInitialProps = async (ctx) => {
  //#region Test
  console.log("dailyboard/[dateStr]/ - getInitialProps");

  return { dateStr: ctx.query.dateStr };
};

export default dailyBoard;
