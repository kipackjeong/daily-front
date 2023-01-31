import { Flex } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CurrentTimeLine from "./CurrentTimeLine";
import TimeBlock from "./TimeBlock";
import { Scrollbars } from "react-custom-scrollbars";
import DeleteButton from "../../../core/components/DeleteButton";

import { ITask, taskService } from "../../models/task";
import {
  selectTasks,
  selectSelectedTasks,
  taskActions,
} from "../../redux/slices/task.slice";

import { selectDate } from "../../redux/slices/date.slice";
import { useUISetting } from "../../hooks/useUISettings";

type TimeTableProps = {
  flex?: number;
  isMini: boolean;
};

type Payload = {
  date: Date;
  tasksArr: ITask[];
};

const TimeTable = ({ flex, isMini }: TimeTableProps) => {
  console.log("TimeTable - render");

  const dispatch = useDispatch();
  const selectedDate = useSelector(selectDate);
  const tasks = useSelector(selectTasks);
  const selectedTasks = useSelector(selectSelectedTasks);
  const [currentTime, setCurrentTime] = useState(new Date(Date.now()));
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const { incrementPixelPerHour, decrementPixelPerHour } = useUISetting();

  useEffect(() => {
    if (selectedTasks.length > 1) {
      setShowDeleteBtn(true);
    } else {
      setShowDeleteBtn(false);
    }
  }, [selectedTasks]);

  useEffect(() => {
    document.addEventListener("keydown", detectKeydown, true);
  }, [selectedTasks]);

  useEffect(() => {
    document.addEventListener("mousewheel", detectMouseWheel, {
      passive: false,
      capture: true,
    });
  });

  const detectMouseWheel = async (e) => {
    e.stopPropagation();
    const { deltaY } = e;
    // when it goes up
    if (deltaY < 0 && e.ctrlKey) {
      incrementPixelPerHour();
      e.preventDefault();
    }
    // when it goes down
    else if (deltaY > 0 && e.ctrlKey) {
      decrementPixelPerHour();
      e.preventDefault();
    }
  };

  const detectKeydown = async (e) => {
    if (e.key == "Delete" && selectedTasks) {
      await taskService.deleteMultipleTasksById(selectedTasks, dispatch);
    }
  };

  const prePayloads = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const newDate = new Date(selectedDate);
      newDate.setHours(0 + i);
      newDate.setMinutes(0);
      newDate.setSeconds(0);

      return {
        date: newDate,
        tasksArr: [],
      };
    });
  }, []);

  const payloads = useMemo(() => {
    const result = [...prePayloads];

    result.forEach((payload) => {
      payload.tasksArr = [];
    });

    tasks.forEach((t) => {
      const idx = t.timeInterval.startTime.getHours();

      result[idx].tasksArr.push(t);
    });

    return result;
  }, [tasks]);

  //#region atom components
  const timeBlocks = (
    <>
      {payloads.map((p, i) => {
        return (
          <TimeBlock
            key={i}
            id={p.date.toTimeString()}
            time={p.date}
            tasksArr={p.tasksArr}
            isMini={isMini}
          />
        );
      })}
    </>
  );

  //#endregion

  //#region Handlers
  async function onMultiDeleteClick() {
    await taskService.deleteMultipleTasksById(selectedTasks, dispatch);
  }
  //#endregion

  return (
    <>
      {showDeleteBtn && (
        <DeleteButton
          position="absolute"
          top="21%"
          right="4%"
          color="brand.heavy"
          onClick={onMultiDeleteClick}
          border="none"
          zIndex={3}
        />
      )}
      <Flex
        sx={{
          position: "relative",
          height: "100%",
          width: "100%",
        }}
        flex={0.85}
      >
        <Scrollbars autoHide={true}>
          <Flex
            height="100%"
            width="100%"
            flexDir={"column"}
            justifyContent="flex-start"
            flexFlow={"wrap"}
          >
            {selectedDate.getDate() == new Date(Date.now()).getDate() && (
              <CurrentTimeLine currentTime={currentTime} />
            )}
            {timeBlocks}
          </Flex>
        </Scrollbars>
      </Flex>
    </>
  );
};

export default TimeTable;
