import React, { useEffect, useMemo, useState } from "react";
import { Box, Divider, Flex, Text, useStyleConfig } from "@chakra-ui/react";
import TaskBlock from "../task/TaskBlock/TaskBlock";

import { useDispatch, useSelector } from "react-redux";
import { ITask, taskService } from "../../models/task";
import {
  convertPXtoMinute,
  getHeight,
  getOffset,
  roundToIntervalFive,
  toHourOnlyString,
} from "../../utils/helper";
import { selectDate } from "../../redux/slices/date.slice";
import TaskForm from "../task/TaskForm/TaskForm";
import { useUISetting } from "../../hooks/useUISettings";

type TimeBlockProps = {
  id;
  time: Date;
  tasksArr: ITask[];
  isMini: boolean;
};

const TimeBlock = ({ id, time, tasksArr, isMini }: TimeBlockProps) => {
  // console.log("TimeBlock - render");

  //#region Hooks
  // const [tasksInThisBlock, setTasksInThisBLock] = useState(tasksArr);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState(null);
  const { pixelPerHour } = useUISetting();

  //#endregion

  // useEffect(() => {
  //   setTasksInThisBLock(tasksArr);
  // }, [tasksArr]);

  //#region Handlers
  async function onClickHandler(e) {
    const blockHeight = getHeight(e.target as HTMLDivElement);
    const blockLocY = getOffset(e.target).y;
    const clickedLocY = e.clientY;

    const yDiff = clickedLocY - blockLocY;

    const taskStartTime = new Date(time);

    const minuteToAdd = roundToIntervalFive(
      convertPXtoMinute(yDiff, pixelPerHour) % 60
    );

    taskStartTime.setMinutes(time.getMinutes() + minuteToAdd);

    const taskEndTime = new Date(taskStartTime);

    taskEndTime.setMinutes(taskEndTime.getMinutes() + 10);

    const payload: ITask = {
      timeInterval: { startTime: taskStartTime, endTime: taskEndTime },
      taskType: "DID",
    };

    setShowTaskForm(true);
    setNewTask(payload);
  }

  function onTaskFormSubmitHandler() {
    setShowTaskForm(false);
    setNewTask(null);
  }
  function onTaskFormCancelHandler() {
    setShowTaskForm(false);
    setNewTask(null);
  }

  //#endregion

  // #region Styles
  const dividerStyle = useStyleConfig("Divider", {
    variant: "timeBlockDivider",
  });
  //#endregion

  //#region Components

  const taskBlocks = useMemo(() => {
    return (
      tasksArr.length != 0 &&
      tasksArr.map((task, i) => {
        if (task.timeInterval.startTime.getHours() == time.getHours()) {
          return <TaskBlock key={i} task={task} isMini={isMini} />;
        }
      })
    );
  }, [tasksArr]);

  //#endregion

  return (
    <Box
      id={id}
      position="relative"
      width={"100%"}
      height={`${pixelPerHour}px`}
      cursor={"pointer"}
      _hover={{ backgroundColor: "brand.light" }}
    >
      {showTaskForm && (
        <TaskForm
          task={newTask}
          onSubmit={onTaskFormSubmitHandler}
          onCancel={onTaskFormCancelHandler}
        ></TaskForm>
      )}
      {taskBlocks}
      <Box
        flexDir="column"
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
        flex={1}
        height="100%"
        onClick={onClickHandler}
      >
        <Divider pointerEvents={"none"} __css={dividerStyle} />

        <Flex>
          <Text fontSize={isMini ? "x-small" : "sm"}>
            {toHourOnlyString(time)}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default TimeBlock;
