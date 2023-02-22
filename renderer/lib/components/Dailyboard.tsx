import { Flex, Spinner } from "@chakra-ui/react";
import taskService from "@lib/services/task/task.service";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppStatus } from "../hooks/useAppStatus";
import { dateActions, selectDate } from "../redux/slices/date.slice";
import { appStoreWrapper } from "../redux/stores/app.store";
import taskLocalService from "../services/task/task.local-service";
import DateSelectionBar from "./date-selection/DateSelectionBar";
import TimeTable from "./timetables/TimeTable";

type DailyBoardProps = {
  isMini?: boolean;
};

const DailyBoard = ({ isMini = false }: DailyBoardProps) => {
  console.log("DailyBoard renders");

  const { store } = appStoreWrapper.useWrappedStore({});
  const { isOnline } = useAppStatus();

  const dispatch = store.dispatch;
  const date = useSelector(selectDate);

  useEffect(() => {
    console.log("DailyBoard - useEffect - refreshTasks()");
    console.log(" Refreshing tasks...");

    async function refreshTasks() {
      isOnline
        ? await taskService.findTasksByDate(date, dispatch)
        : await taskLocalService.findAllByDate(date, dispatch);
    }

    if (date) {
      refreshTasks();
    }
  }, [date]);

  async function onDateSelectHandler(date) {
    dispatch(dateActions.setDate(date));

    isOnline
      ? await taskService.findTasksByDate(date, dispatch)
      : await taskLocalService.findAllByDate(date, dispatch);
  }

  return date ? (
    <Flex className="dailyboard" h="100%" flexDir="column">
      <DateSelectionBar onDateSelect={onDateSelectHandler} isMini={isMini} />
      <TimeTable isMini={isMini} />
    </Flex>
  ) : (
    <Spinner />
  );
};

export default DailyBoard;
