import { Flex, Button, Text, useStyleConfig, HStack } from "@chakra-ui/react";
import React, { MouseEventHandler, useMemo, useState } from "react";
import { AddIcon, ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import DateBox from "./atoms/DateBox";
import TaskForm from "../task/TaskForm/TaskForm";
import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/router";
import {
  getMonthInStr,
  getNowHour,
  getNowMinute,
  isThisDateToday,
} from "../../utils/helper";
import { selectLatestTask } from "../../redux/slices/task.slice";
import { ITask } from "../../models/task";
import {
  dateActions,
  selectDate,
  selectDates,
} from "../../redux/slices/date.slice";
import TaskFactory from "../../models/task/task.factory";

type DateSelectionBarProps = {
  flex?: number;
  isMini: boolean;
  onDateSelect: MouseEventHandler;
};
const DateSelectionBar = ({ isMini, onDateSelect }: DateSelectionBarProps) => {
  console.log("DateSelectionBar renders");

  // #region Hooks
  const date = useSelector(selectDate);
  const dates = useSelector(selectDates);

  const latestTask: ITask = useSelector(selectLatestTask);

  const [newTask, setNewTask] = useState(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // #endregion

  // #region Styles
  const containerStyle = useStyleConfig("Flex", {
    variant: "dateSelectionBarBox",
  });
  // #endregion

  const [prevWeekDateStr, nextWeekDateStr] = useMemo(() => {
    const oneDayInMS = 86400000;

    const dateInDate = new Date(date).getTime();

    return [
      new Date(dateInDate - 7 * oneDayInMS).toISOString().split("T")[0],
      new Date(dateInDate + 7 * oneDayInMS).toISOString().split("T")[0],
    ];
  }, [date]);

  console.log("nextWeekDateStr: " + nextWeekDateStr);
  //#region Handler

  function onAddTodoClickHandler(e) {
    setShowItemForm(true);

    let defaultHr;
    let defaultMin;

    if (isThisDateToday(date)) {
      defaultHr = getNowHour();
      defaultMin = getNowMinute();
    } else {
      defaultHr = 6;
      defaultMin = 0;
    }

    const startTime = new Date(date);
    const endTime = new Date(date);

    startTime.setHours(defaultHr);
    startTime.setMinutes(defaultMin);

    endTime.setHours(defaultHr);
    endTime.setMinutes(defaultMin + 10);

    setNewTask(TaskFactory.createEmptyTodo(startTime, endTime));
  }

  function onAddDidClickHandler(e) {
    setShowItemForm(true);

    let defaultHr;
    let defaultMin;

    if (isThisDateToday(date)) {
      defaultHr = getNowHour();
      defaultMin = getNowMinute();
    } else {
      defaultHr = 6;
      defaultMin = 0;
    }

    const startTime = new Date(date);
    const endTime = new Date(date);

    startTime.setHours(defaultHr);
    startTime.setMinutes(defaultMin - 10);

    endTime.setHours(defaultHr);
    endTime.setMinutes(defaultMin);

    setNewTask(TaskFactory.createEmptyDid(startTime, endTime));
  }

  //#endregion

  const dateBoxFontSizes = isMini ? ["1rem", "0.7rem"] : ["1.5rem", "1rem"];

  return (
    <>
      {showItemForm && (
        <TaskForm
          task={newTask}
          setTask={setNewTask}
          onSubmit={() => setShowItemForm(false)}
          onCancel={() => setShowItemForm(false)}
        />
      )}
      <Flex
        flex={0.15}
        className="date-selection"
        __css={containerStyle}
        flexDir="column"
      >
        <Flex p={5} width="100%" justifyContent={"space-between"}>
          <Text fontWeight="bold" fontSize={isMini ? "1.5rem" : "2rem"}>
            {getMonthInStr(date)}
          </Text>
          <HStack spacing={1}>
            <Button p={2} border="none" onClick={onAddTodoClickHandler}>
              <AddIcon m={1} />
              Todo
            </Button>
            <Button p={2} border="none" onClick={onAddDidClickHandler}>
              <AddIcon m={1} />
              Did
            </Button>
          </HStack>
        </Flex>
        <Flex width="100%" justifyContent={"space-evenly"}>
          {!isMini && (
            <ArrowBackIcon
              cursor={"pointer"}
              onClick={() => {
                const prevWeekDate = new Date(prevWeekDateStr);
                dispatch(dateActions.setDate(prevWeekDate));
                dispatch(dateActions.setDates(prevWeekDate));
              }}
            />
          )}

          {dates.map((d, i) => {
            if (date.getMonth() != d.getMonth()) {
              return (
                <DateBox
                  key={i}
                  date={d}
                  fontSizes={dateBoxFontSizes}
                  isShallow={true}
                  onClick={onDateSelect}
                ></DateBox>
              );
            } else if (date.getDate() == d.getDate()) {
              return (
                <DateBox
                  key={i}
                  date={date}
                  fontSizes={dateBoxFontSizes}
                  onClick={onDateSelect}
                  isHighlight={true}
                ></DateBox>
              );
            }

            return (
              <DateBox
                key={i}
                date={d}
                fontSizes={dateBoxFontSizes}
                onClick={onDateSelect}
              ></DateBox>
            );
          })}

          {!isMini && (
            <ArrowForwardIcon
              cursor={"pointer"}
              onClick={() => {
                // click next week
                const nextWeekDate = new Date(nextWeekDateStr);
                dispatch(dateActions.setDate(nextWeekDate));
                dispatch(dateActions.setDates(nextWeekDate));
              }}
            />
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default DateSelectionBar;
