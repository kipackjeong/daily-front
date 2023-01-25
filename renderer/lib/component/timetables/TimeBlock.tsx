import React, { useEffect, useMemo, useState } from "react";
import { Box, Divider, Flex, Text, useStyleConfig } from "@chakra-ui/react";
import { pixelPerHour } from "./constant";
import TaskBlock from "../task/TaskBlock/TaskBlock";

import TaskForm from "../task/TaskForm/TaskForm";
import { useDispatch, useSelector } from "react-redux";
import { ITask, taskActions, taskService } from "../../models/task";
import { getHeight, getOffset, convertPXtoMinute } from "../../utils/converter";
import { getPositionFromTheDate, toHourOnlyString } from "../../utils/helper";
import {
  selectDates,
  selectSelectedDate,
} from "../../models/app-date/app-date.slice";

type TimeBlockProps = {
  id;
  time: Date;
  tasksArr: ITask[];
  isMini: boolean;
};

const TimeBlock = ({ id, time, tasksArr, isMini }: TimeBlockProps) => {
  console.log("TimeBlock - render");

  //#region Hooks
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);

  const [tasks, setTasks] = useState(tasksArr);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const [height, setHeight] = useState<string>("1px");
  const [positionY, setPositionY] = useState(getPositionFromTheDate(time));
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

    taskStartTime.setMinutes(
      time.getMinutes() + (convertPXtoMinute(yDiff) % 60)
    );

    const taskEndTime = new Date(taskStartTime);
    taskEndTime.setMinutes(taskEndTime.getMinutes() + 10);

    const payload: ITask = {
      position: position,
      timeInterval: { startTime: taskStartTime, endTime: taskEndTime },
    };

    await taskService.createTask(payload, selectedDate, dispatch);
  }

  //TODO: implement drag draw task block.
  const onTaskFormSubmitHandler = () => {
    setShowTaskForm(false);
  };

  function onTaskFormCancelClick(task: ITask) {
    setShowTaskForm(false);
    setTasks((prev) => [...prev.slice(0, prev.length - 1)]);
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
        console.log(task);
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
      {showTaskForm && (
        <TaskForm
          task={tasks.at(tasks.length - 1)}
          onSubmit={onTaskFormSubmitHandler}
          onCancel={onTaskFormCancelClick}
        />
      )}

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
