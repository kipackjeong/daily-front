import React, { useEffect, useMemo, useState } from "react";
import { Box, Divider, Flex, Text, useStyleConfig } from "@chakra-ui/react";
import { pixelPerHour } from "./constant";
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

type TimeBlockProps = {
  id;
  time: Date;
  tasksArr: ITask[];
  isMini: boolean;
};

const TimeBlock = ({ id, time, tasksArr, isMini }: TimeBlockProps) => {
  // console.log("TimeBlock - render");

  //#region Hooks
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectDate);

  const [tasks, setTasks] = useState(tasksArr);

  //#endregion

  useEffect(() => {
    setTasks(tasksArr);
  }, [tasksArr]);

  //#region Handlers
  async function onClickHandler(e) {
    const blockHeight = getHeight(e.target as HTMLDivElement);
    console.log("blockHeight: " + blockHeight);
    const blockLocY = getOffset(e.target).y;
    const clickedLocY = e.clientY;
    console.log("blockLocY: " + blockLocY);
    console.log("clickedLocY: " + clickedLocY);

    const yDiff = clickedLocY - blockLocY;

    let position: number;

    if (yDiff == 0) {
      position = 0;
    } else if (blockHeight === 0) {
      return;
    } else {
      position = yDiff * 1.0;
    }
    const taskStartTime = new Date(time);

    const minuteToAdd = roundToIntervalFive(convertPXtoMinute(yDiff) % 60);

    taskStartTime.setMinutes(time.getMinutes() + minuteToAdd);

    const taskEndTime = new Date(taskStartTime);
    
    taskEndTime.setMinutes(taskEndTime.getMinutes() + 10);

    const payload: ITask = {
      timeInterval: { startTime: taskStartTime, endTime: taskEndTime },
    };

    await taskService.createTask(payload, selectedDate, dispatch);
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
      tasks.length != 0 &&
      tasks.map((task, i) => {
        if (task.timeInterval.startTime.getHours() == time.getHours()) {
          return <TaskBlock key={i} task={task} />;
        }
      })
    );
  }, [tasks]);

  //#endregion

  return (
    <Box
      id={id}
      position="relative"
      width={"100%"}
      height={`${pixelPerHour}px`}
      cursor={"pointer"}
      _hover={{ backgroundColor: "brand.lightGray" }}
    >
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
