import { Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useAppStatus } from "../hooks/useAppStatus";
import { taskService } from "../models/task";
import taskLocalService from "../models/task/task.local-service";
import {
  dateActions,
  selectDate,
  selectDates,
} from "../redux/slices/date.slice";
import { appStoreWrapper } from "../redux/stores/app.store";
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
  const storeState = store.getState();

  const date = storeState.date.date;
  const dates = storeState.date.dates;

  useEffect(() => {
    console.log("DailyBoard - useEffect - refreshTasks()");
    console.log(" Refreshing tasks...");

    async function refreshTasks() {

      
      isOnline
        ? await taskService.refreshTasksByDate(date, dispatch)
        : await taskLocalService.findAllByDate(date, dispatch);
    }

    if (date) {
      refreshTasks();
    }
  }, [date]);

  async function onDateSelectHandler(date) {
    dispatch(dateActions.setDate(date));

    isOnline
      ? await taskService.refreshTasksByDate(date, dispatch)
      : await taskLocalService.findAllByDate(date, dispatch);
  }

  return date ? (
    <Provider store={store}>
      <Flex h="100%" flexDir="column">
        <DateSelectionBar onDateSelect={onDateSelectHandler} isMini={isMini} />
        <TimeTable isMini={isMini} />
      </Flex>
    </Provider>
  ) : (
    <Spinner />
  );
};

export default DailyBoard;
