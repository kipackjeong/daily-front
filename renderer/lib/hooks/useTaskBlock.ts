import { useStyleConfig } from "@chakra-ui/react";
import {
  convertTimeIntervalToPxHeight,
  getPositionFromStartTime,
  toPrecision,
  convertPXtoSeconds,
  addSeconds,
  findOverlappedTask,
  adjustIntervalToStartAfter,
  adjustIntervalToStartBefore,
} from "@core/utils/helper";
import { ITask } from "@lib/models/task";
import {
  selectSelectedTasks,
  selectTasks,
  taskActions,
} from "@lib/redux/slices/task.slice";
import taskLocalService from "@lib/services/task/task.local-service";
import taskService from "@lib/services/task/task.service";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DraggableData } from "react-rnd";
import { useAppStatus } from "./useAppStatus";
import useMediaSize from "./useMediaSize";
import { useUISetting } from "./useUISettings";

type useTaskBlockParameter = {
  task;
  isMini;
};
const useTaskBlock = ({ task, isMini }: useTaskBlockParameter) => {
  const dispatch = useDispatch();
  const selectedTasks = useSelector(selectSelectedTasks);
  const tasks = useSelector(selectTasks);
  const { isOnline } = useAppStatus();
  const { isBase, isSM, isMD, isLG, isXL } = useMediaSize();
  const { pixelPerHour, pixelPerMinute } = useUISetting();
  const taskBlockRef = useRef();
  const [height, setHeight] = useState<number>(
    convertTimeIntervalToPxHeight(task.timeInterval, pixelPerHour) == 0
      ? 1
      : convertTimeIntervalToPxHeight(task.timeInterval, pixelPerHour)
  );
  const taskSelected = selectedTasks.includes(task._id);

  const [showSideButtons, setShowSideButtons] = useState(taskSelected);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showDescriptionForm, setShowDescriptionForm] = useState(false);

  // needed for long touch behavior
  const [longTouch, setLongTouch] = useState(false);
  let timerId;

  useEffect(() => {
    setPositionY(getPositionFromStartTime(task.timeInterval, pixelPerHour));
  }, [tasks, pixelPerHour]);

  useEffect(() => {
    setShowSideButtons(taskSelected);
  }, [taskSelected]);

  // sets block's height by task's timeinterval
  useEffect(() => {
    setHeight(convertTimeIntervalToPxHeight(task.timeInterval, pixelPerHour));
  }, [tasks, pixelPerHour]);

  const [positionY, setPositionY] = useState(
    getPositionFromStartTime(task.timeInterval, pixelPerHour)
  );

  const onMouseOverHandler = () => {
    setShowSideButtons(true);
  };

  const onMouseOutHandler = () => {
    if (!taskSelected) {
      setShowSideButtons(false);
    }
  };

  const onResizeHandler = async (e, direction, ref, delta, position) => {
    e.preventDefault();

    const pxToAdd = ref.offsetHeight - height;

    if (Math.abs(toPrecision(pxToAdd, 100)) >= pixelPerMinute) {
      const secondsToAdd = convertPXtoSeconds(pxToAdd, pixelPerMinute);

      setHeight(ref.offsetHeight);

      if (direction == "top") {
        addSeconds(task.timeInterval.startTime, -secondsToAdd);
      } else {
        addSeconds(task.timeInterval.endTime, secondsToAdd);
      }
    }

    // }
  };

  const onResizeStopHandler = async (e, direction, ref, delta, position) => {
    isOnline
      ? await taskService.update(task, dispatch)
      : await taskLocalService.update(task, dispatch);
  };

  const onDragHandler = (e: DragEvent, d: DraggableData) => {
    e.preventDefault();

    let yd = d.y - positionY;

    if (Math.abs(yd) >= pixelPerMinute) {
      setPositionY(d.y);
      const secondsToAdd = convertPXtoSeconds(yd, pixelPerMinute);

      addSeconds(task.timeInterval.startTime, secondsToAdd);
      addSeconds(task.timeInterval.endTime, secondsToAdd);
    }
  };

  const onDragStopHandler = (e: DragEvent, d: DraggableData) => {
    e.preventDefault();

    // to prevent task time overlapping
    let updatedTask = { ...task };

    let { overlappedTask, overlappedTaskIdx } = findOverlappedTask(
      tasks,
      updatedTask
    );

    if (overlappedTask) {
      console.log("has overlappin task");
      // find direction to go (above or below)
      let direction: string;
      let updatedTaskMiddleTime =
        (updatedTask.timeInterval.endTime.getTime() -
          updatedTask.timeInterval.startTime.getTime()) /
          2 +
        updatedTask.timeInterval.startTime.getTime();

      const startDiff = Math.abs(
        overlappedTask.timeInterval.startTime.getTime() - updatedTaskMiddleTime
      );

      const endDiff = Math.abs(
        overlappedTask.timeInterval.endTime.getTime() - updatedTaskMiddleTime
      );

      direction = startDiff < endDiff ? "above" : "below";

      let taskToAttachTo;

      let aheadTasks = tasks.filter((t) => t._id != task._id);
      if (direction == "below") {
        aheadTasks = aheadTasks.slice(overlappedTaskIdx, aheadTasks.length);

        taskToAttachTo = findTaskToAttachTo(aheadTasks, updatedTask);

        if (!taskToAttachTo) {
          return;
        }

        // set updatedTask's start time to end time of taskToAttachTo
        updatedTask = adjustIntervalToStartAfter(updatedTask, taskToAttachTo);
      } else {
        aheadTasks = aheadTasks.slice(0, overlappedTaskIdx + 1).reverse();

        taskToAttachTo = findTaskToAttachTo(aheadTasks, updatedTask);

        if (!taskToAttachTo) {
          return;
        }

        updatedTask = adjustIntervalToStartBefore(updatedTask, taskToAttachTo);
      }
    }

    // prevents onclick triggering ondragstop
    if (d.y != positionY) {
      isOnline
        ? taskService.update(updatedTask, dispatch)
        : taskLocalService.update(updatedTask, dispatch);
    }

    function findTaskToAttachTo(aheadTasks: ITask[], targetTask) {
      return aheadTasks.find((t, i) => {
        const currentTaskEndTime = t.timeInterval.endTime;

        let nextTask;
        if (i < tasks.length - 1) {
          nextTask = aheadTasks.at(i + 1);
        } else {
          nextTask = null;
        }

        if (!nextTask) {
          return true;
        }

        const gap = Math.abs(
          currentTaskEndTime.getTime() -
            nextTask.timeInterval.startTime.getTime()
        );
        console.log("gap: " + gap);

        if (
          gap <
          targetTask.timeInterval.endTime.getTime() -
            targetTask.timeInterval.startTime.getTime()
        ) {
          return false;
        } else {
          return true;
        }
      });
    }
  };

  const onClickHandler = useCallback(
    async (e) => {
      console.log("TaskBlock -- onClickHandler");
      e.preventDefault();
      e.stopPropagation();

      if (e.detail == 2) {
        // double click
        // show reflection/edit form
        if (task.detail) {
          setShowDescriptionForm(true);
        } else {
          setShowTaskForm(true);
        }

        dispatch(taskActions.deselectTask(task._id));
      } else {
        // one click
        console.log("-- clicked taskblock with task id: " + task._id);

        // if selected with ctr key down, that means selecting multiple.
        if (e.nativeEvent.ctrlKey) {
          dispatch(taskActions.multiSelectTask(task._id));

          return;
        }

        // update redux
        if (!taskSelected) {
          console.log("-- TaskBlock clicked when is not selected.");

          dispatch(taskActions.selectTask(task._id));
        } else {
          console.log("-- TaskBlock clicked when is selected.");

          dispatch(taskActions.deselectTask(task._id));
        }
      }
    },
    [task, selectedTasks]
  );

  const onTaskFormSubmit = useCallback(() => {
    setShowTaskForm(false);
  }, []);
  const onTaskFormCancel = useCallback(() => {
    setShowTaskForm(false);
  }, []);

  const onTouchStartHandler = () => {
    timerId = setTimeout(() => setLongTouch(true), 500);
  };

  const onTouchEndHandler = (): React.TouchEventHandler<HTMLDivElement> => {
    return () => {
      clearTimeout(timerId);
      if (longTouch) {
        setLongTouch(false);
        setShowDescriptionForm(true);
      }
    };
  };

  // #region Block

  const containerStyle = useStyleConfig("Flex", {
    variant: "taskBlockBox",
  });

  const blockBGColor = taskSelected
    ? task.taskType == "To Do"
      ? "brand.green.250"
      : "brand.regular"
    : task.taskType == "To Do"
    ? "brand.green.100"
    : "brand.light";

  const dynamicStyle = {
    backgroundColor: blockBGColor,
    color: "brand.heavy",
    _hover: {
      backgroundColor:
        task.taskType == "To Do" ? "brand.green.250" : "brand.regular",
    },
  };

  let width = useMemo(() => {
    if (isXL) {
      return isMini ? "95%" : "94.7%";
    }
    if (isLG) {
      return isMini ? "94.5%" : "91.5%";
    }
    if (isMD) {
      return isMini ? "90%" : "90.7%";
    }
    if (isSM) {
      return isMini ? "86%" : "88%";
    }
    if (isBase) {
      return "88%";
    }
    return "95%";
  }, [isBase, isSM, isMD, isLG, isXL]);

  return {
    onMouseOverHandler,
    onMouseOutHandler,
    onResizeHandler,
    onResizeStopHandler,
    onDragHandler,
    onDragStopHandler,
    onClickHandler,
    onTaskFormSubmit,
    onTaskFormCancel,
    onTouchEndHandler,
    onTouchStartHandler,
    setShowDescriptionForm,
    containerStyle,
    blockBGColor,
    dynamicStyle,
    positionY,
    height,
    width,
    taskBlockRef,
    showSideButtons,
    showTaskForm,
    showDescriptionForm,
  };
};

export default useTaskBlock;
