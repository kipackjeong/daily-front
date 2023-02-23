import { Flex } from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CurrentTimeLine from "./CurrentTimeLine";
import TimeBlock from "./TimeBlock";
import { Scrollbars } from "react-custom-scrollbars";
import DeleteButton from "@core/components/buttons/DeleteButton";
import {
  selectTasks,
  selectSelectedTasks,
  taskActions,
} from "../../redux/slices/task.slice";

import { selectDate } from "../../redux/slices/date.slice";
import { useUISetting } from "../../hooks/useUISettings";
import { useAppStatus } from "../../hooks/useAppStatus";
import taskLocalService from "../../services/task/task.local-service";
import taskService from "@lib/services/task/task.service";

type TimeTableProps = {
  flex?: number;
  isMini: boolean;
};

const TimeTable = ({ flex, isMini }: TimeTableProps) => {
  console.log("TimeTable - render");

  const dispatch = useDispatch();
  const selectedDate = useSelector(selectDate);
  const tasks = useSelector(selectTasks);
  const timeTableRef = useRef(null);
  const selectedTasks = useSelector(selectSelectedTasks);
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const { incrementPixelPerHour, decrementPixelPerHour } = useUISetting();
  const { isOnline } = useAppStatus();

  useEffect(() => {
    if (selectedTasks.length > 1) {
      setShowDeleteBtn(true);
    } else {
      setShowDeleteBtn(false);
    }
  }, [selectedTasks]);

  useEffect(() => {
    document.addEventListener("keydown", detectKeydown, true);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("keydown", detectKeydown);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [selectedTasks]);

  useEffect(() => {
    document.addEventListener("mousewheel", detectMouseWheel, {
      passive: false,
      capture: true,
    });
    document.removeEventListener("mouseWheel", detectMouseWheel);
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

  const handleOutsideClick = (event) => {
    if (timeTableRef.current && !timeTableRef.current.contains(event.target)) {
      // If the user clicks outside of the selectable div, unselect all items
      dispatch(taskActions.resetSelectedTask());
    }
  };
  const detectKeydown = async (e) => {
    if (e.key == "Delete" && selectedTasks) {
      isOnline
        ? await taskService.deleteMultipleTasks(selectedTasks, dispatch)
        : await taskLocalService.deleteMultipleTasks(selectedTasks, dispatch);
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
    isOnline
      ? await taskService.deleteMultipleTasks(selectedTasks, dispatch)
      : await taskLocalService.deleteMultipleTasks(selectedTasks, dispatch);
  }
  //#endregion

  return (
    <>
      <Flex position="relative" height="100%" flex={0.85} ref={timeTableRef}>
        {showDeleteBtn && (
          <DeleteButton
            position="absolute"
            top={0}
            right={0}
            color={"brand.heavy"}
            _hover={{ color: "brand.red.300" }}
            onClick={onMultiDeleteClick}
            border="none"
            zIndex={3}
          />
        )}
        <Scrollbars autoHide={true}>
          <Flex
            height="100%"
            width="100%"
            flexDir={"column"}
            justifyContent="flex-start"
            flexFlow={"wrap"}
          >
            {selectedDate.getDate() == new Date(Date.now()).getDate() && (
              <CurrentTimeLine isMini={isMini} />
            )}
            {timeBlocks}
          </Flex>
        </Scrollbars>
      </Flex>
    </>
  );
};

export default TimeTable;
