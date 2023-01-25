import { Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import appDateService from "../models/app-date/app-date.service";
import {
  selectDates,
  selectSelectedDate,
  setSelectedDate,
} from "../models/app-date/app-date.slice";
import { taskService } from "../models/task";
import DateSelectionBar from "./date-selection/DateSelectionBar";
import TimeTable from "./timetables/TimeTable";

type DailyBoardProps = {
  dateStr: string;
  isMini?: boolean;
};

const DailyBoard = ({ dateStr, isMini = false }: DailyBoardProps) => {
  console.log("DailyBoard renders");

  const dispatch = useDispatch();
  const dates = useSelector(selectDates);
  const selectedDate = useSelector(selectSelectedDate);

  useEffect(() => {
    console.log("DailyBoard - useEffect - fetchDates()");

    async function fetchDates() {
      console.log(" Fetching app-dates...");

      await appDateService.findByDateStr(dateStr, dispatch);
    }

    fetchDates();
  }, []);

  useEffect(() => {
    console.log("DailyBoard - useEffect - refreshTasks()");

    console.log(" Refreshing tasks...");

    async function refreshTasks() {
      await taskService.refreshTasksByDate(selectedDate, dispatch);
    }

    if (selectedDate) {
      refreshTasks();
    }
  }, [selectedDate]);

  async function onDateSelectHandler(date) {
    dispatch(setSelectedDate(date));

    await taskService.refreshTasksByDate(date, dispatch);
  }

  return dates && dates.length != 0 && selectedDate ? (
    <Flex h="100%" flexDir="column">
      <DateSelectionBar onDateSelect={onDateSelectHandler} isMini={isMini} />
      <TimeTable isMini={isMini} />
    </Flex>
  ) : (
    <Spinner />
  );
};

export default DailyBoard;
