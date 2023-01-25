import { Flex, Button, Text, useStyleConfig, HStack } from "@chakra-ui/react";
import React, { MouseEventHandler, useMemo, useState } from "react";
import { AddIcon, ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import DateBox from "./atoms/DateBox";
import TaskForm from "../task/TaskForm/TaskForm";
import { useSelector } from "react-redux";

import { useRouter } from "next/router";
import { IAppDate } from "../../models/app-date";
import {
  selectDates,
  selectSelectedDate,
} from "../../models/app-date/app-date.slice";
import { getNowHour, getNowMinute } from "../../utils/helper";
import { selectLatestTask } from "../../models/task/task.slice";
import { ITask } from "../../models/task";

type DateSelectionBarProps = {
  flex?: number;
  isMini: boolean;
  onDateSelect: MouseEventHandler;
};
const DateSelectionBar = ({ isMini, onDateSelect }: DateSelectionBarProps) => {
  console.log("DateSelectionBar renders");

  // #region Hooks
  const dates = useSelector(selectDates);
  const selectedDate: IAppDate = useSelector(selectSelectedDate);
  const latestTask: ITask = useSelector(selectLatestTask);

  const [newTask, setNewTask] = useState(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const router = useRouter();
  // #endregion

  // #region Styles
  const containerStyle = useStyleConfig("Flex", {
    variant: "dateSelectionBarBox",
  });
  // #endregion

  const [prevWeekDateStr, nextWeekDateStr] = useMemo(() => {
    const { year, month, date } = selectedDate;

    const oneDayInMS = 86400000;

    const dateInDate = new Date(year, month, date).getTime();

    return [
      new Date(dateInDate - 7 * oneDayInMS).toISOString().split("T")[0],
      new Date(dateInDate + 7 * oneDayInMS).toISOString().split("T")[0],
    ];
  }, [selectedDate]);

  //#region Handler

  function onAddTodoClickHandler(e) {
    setShowItemForm(true);

    const { year, month, date } = selectedDate;
    const hourNow = getNowHour();
    const minNow = getNowMinute();

    setNewTask({
      taskType: "TODO",
      title: "",
      focusLevel: 50,
      timeInterval: {
        startTime: new Date(year, month, date - 1, hourNow, minNow),
        endTime: new Date(year, month, date - 1, hourNow, minNow + 20),
        taskType: "TODO",
      },
    });
  }

  function onAddDidClickHandler(e) {
    setShowItemForm(true);

    const { year, month, date } = selectedDate;
    const hourNow = getNowHour();
    const minNow = getNowMinute();

    setNewTask({
      taskType: "DID",
      title: "",
      focusLevel: 50,
      timeInterval: {
        startTime: new Date(year, month, date - 1, hourNow - 1, minNow),
        endTime: new Date(year, month, date - 1, hourNow, minNow),
        taskType: "TODO",
      },
    });
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
            {selectedDate.getMonthInStr()}
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
                router
                  .replace(`/dailyboard/${prevWeekDateStr}`)
                  .then(() => router.reload());
              }}
            />
          )}

          {dates.map((date, i) => {
            if (date.month != selectedDate.month) {
              return (
                <DateBox
                  key={i}
                  date={date}
                  fontSizes={dateBoxFontSizes}
                  isShallow={true}
                  onClick={onDateSelect}
                ></DateBox>
              );
            } else if (date.id == selectedDate.id) {
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
                date={date}
                fontSizes={dateBoxFontSizes}
                onClick={onDateSelect}
              ></DateBox>
            );
          })}

          {!isMini && (
            <ArrowForwardIcon
              cursor={"pointer"}
              onClick={() => {
                router
                  .replace(`/dailyboard/${nextWeekDateStr}`)
                  .then(() => router.reload());
              }}
            />
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default DateSelectionBar;
