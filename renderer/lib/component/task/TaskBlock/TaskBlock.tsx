import { Flex, useStyleConfig } from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DraggableData, Rnd } from "react-rnd";
import CheckButton from "../../../../core/components/CheckButton";
import DeleteButton from "../../../../core/components/DeleteButton";
import UndoButton from "../../../../core/components/UndoButton";
import { useAppStatus } from "../../../hooks/useAppStatus";
import useMediaSize from "../../../hooks/useMediaSize";
import { useUISetting } from "../../../hooks/useUISettings";
import {
  ITask,
  taskService,
  taskActions,
  selectSelectedTasks,
  selectTasks,
} from "../../../models/task";
import taskLocalService from "../../../models/task/task.local-service";
import {
  convertTimeIntervalToPxHeight,
  convertPXtoSeconds,
  addSeconds,
  adjustIntervalToStartAfter,
  adjustIntervalToStartBefore,
  findOverlappedTask,
  getPositionFromStartTime,
  toPrecision,
} from "../../../utils/helper";
import TaskDescription from "../TaskDescription/TaskDescription";
import TaskForm from "../TaskForm/TaskForm";
import TaskBlockLabel from "./atoms/TaskBlockLabel";

type TaskBlockProps = {
  task: ITask;
  q;
  isMini: boolean;
};

const TaskBlock =
  /**
   * A Block that represents a task in the time table.
   *
   * @param {TaskBlockProps} { task }
   * @returns {*}
   */
  ({ task, isMini = false }: TaskBlockProps) => {
    // console.log("TaskBlock render");

    const dispatch = useDispatch();
    const selectedTasks = useSelector(selectSelectedTasks);
    const tasks = useSelector(selectTasks);
    const { isOnline } = useAppStatus();
    const { isBase, isSM, isMD, isLG, isXL } = useMediaSize();
    const { pixelPerHour, pixelPerMinute } = useUISetting();

    const [height, setHeight] = useState<number>(
      convertTimeIntervalToPxHeight(task.timeInterval, pixelPerHour) == 0
        ? 1
        : convertTimeIntervalToPxHeight(task.timeInterval, pixelPerHour)
    );
    // sets block's height by task's timeinterval
    useEffect(() => {
      setHeight(convertTimeIntervalToPxHeight(task.timeInterval, pixelPerHour));
    }, [tasks, pixelPerHour]);

    const [positionY, setPositionY] = useState(
      getPositionFromStartTime(task.timeInterval, pixelPerHour)
    );

    useEffect(() => {
      setPositionY(getPositionFromStartTime(task.timeInterval, pixelPerHour));
    }, [tasks, pixelPerHour]);

    const taskSelected = selectedTasks.includes(task._id);

    // #region Check / Delete Button

    const [showButtons, setShowDeleteBtn] = useState(taskSelected);

    useEffect(() => {
      setShowDeleteBtn(taskSelected);
    }, [taskSelected]);

    function onMouseOverHandler() {
      setShowDeleteBtn(true);
    }

    function onMouseOutHandler() {
      if (!taskSelected) {
        setShowDeleteBtn(false);
      }
    }

    const onDeleteBtnClickHandler = useCallback(async () => {
      isOnline
        ? await taskService.delete(task, dispatch)
        : await taskLocalService.delete(task._id, dispatch);
    }, [task]);

    const checkBtn =
      task.taskType == "TODO" ? (
        <CheckButton
          padding={0}
          size={isMini && isMD ? "xs" : "sm"}
          onClick={async (e) => {
            e.stopPropagation();

            const payload = { ...task, taskType: "DID" };
            isOnline
              ? await taskService.update(payload, dispatch)
              : await taskLocalService.update(payload, dispatch);
          }}
          color={isMini ? "brand.heavy" : "white"}
          _hover={{ color: isMini ? "brand.green.300" : "brand.green.200" }}
        />
      ) : (
        <UndoButton
          padding={0}
          size={isMini && isMD ? "xs" : "sm"}
          onClick={async (e) => {
            const payload = { ...task, taskType: "TODO" };

            e.stopPropagation();
            isOnline
              ? await taskService.update(payload, dispatch)
              : await taskLocalService.update(payload, dispatch);
            dispatch(taskActions.resetSelectedTask);
          }}
          color={isMini ? "brand.heavy" : "white"}
          _hover={{ color: "brand.green.300" }}
        />
      );
    const deleteBtn = (
      <DeleteButton
        style={{ padding: 0 }}
        size={isMini && isMD ? "xs" : "sm"}
        color={isMini ? "brand.heavy" : "white"}
        _hover={{ color: "brand.red.600" }}
        onClick={onDeleteBtnClickHandler}
      />
    );

    const buttons = (
      <Flex
        style={{
          position: "absolute",
          height: "100%",
          right: isMini && isMD && isSM ? "-10em" : "2%",
          top: isMini ? "-55%" : "0px",
          border: "none",
          alignItems: "center",
          zIndex: 2,
          borderRadius: 0,
        }}
      >
        {checkBtn}
        {deleteBtn}
      </Flex>
    );

    // #endregion

    // #region Block Decoration Line
    const blockDecorationLineColor =
      task.taskType == "TODO" ? "brand.green.600" : "brand.heavy";

    const blockDecorationLine = (
      /* TODO: Color should change per priority level */
      <Flex
        className="task-block_left-deco-line"
        height="100%"
        width="1%"
        bg={blockDecorationLineColor}
        position="absolute"
        left={0}
        borderRadius={2}
      ></Flex>
    );
    // #endregion

    // #region Block Label

    const label = (
      <TaskBlockLabel
        task={task}
        height={height}
        color={(taskSelected && "white") || "brand.heavy"}
        columnGap={{
          base: "11%",
          md: isMini ? "0" : "15%",
          lg: isMini ? "10%" : "25%",
        }}
        fontSize={isMini ? "xs" : "md"}
      />
    );
    // #endregion

    // #region Block

    const containerStyle = useStyleConfig("Flex", { variant: "taskBlockBox" });

    const blockBGColor = taskSelected
      ? task.taskType == "TODO"
        ? "brand.green.600"
        : "brand.heavy"
      : task.taskType == "TODO"
      ? "brand.green.200"
      : "brand.lightGray";

    const dynamicStyle = {
      backgroundColor: blockBGColor,
      color: taskSelected && "white",
    };

    async function onResizeHandler(e, direction, ref, delta, position) {
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
    }

    async function onResizeStopHandler(e, direction, ref, delta, position) {
      isOnline
        ? await taskService.update(task, dispatch)
        : await taskLocalService.update(task, dispatch);
    }

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
          overlappedTask.timeInterval.startTime.getTime() -
            updatedTaskMiddleTime
        );

        const endDiff = Math.abs(
          overlappedTask.timeInterval.endTime.getTime() - updatedTaskMiddleTime
        );

        direction = startDiff < endDiff ? "above" : "below";
        console.log("direction: " + direction);

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

          updatedTask = adjustIntervalToStartBefore(
            updatedTask,
            taskToAttachTo
          );
        }
        console.log("taskToAttachTo: ");
        console.log(taskToAttachTo.detail);
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

    // set width of the block per media's screen size.
    let width = useMemo(() => {
      if (isXL) {
        return isMini ? "92.5%" : "94.7%";
      }
      if (isLG) {
        return isMini ? "91.5%" : "93.5%";
      }
      if (isMD) {
        return isMini ? "88%" : "90.7%";
      }
      if (isSM) {
        return isMini ? "86%" : "88%";
      }
      if (isBase) {
        return "88%";
      }
      return "95%";
    }, [isBase, isSM, isMD, isLG, isXL]);

    // needed for long touch behavior
    const [longTouch, setLongTouch] = useState(false);
    let timerId;

    const block = (
      <Rnd
        className="task-block_rnd"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
          padding: 0,
          borderBlockStyle: "solid",
          borderColor: "brand.heavy",
        }}
        size={{ width: width, height: `${height}px` }}
        position={{ x: isMini ? 35 : 60, y: positionY }}
        onResize={onResizeHandler}
        onResizeStop={onResizeStopHandler}
        onDrag={onDragHandler}
        onDragStop={onDragStopHandler}
        onMouseOver={onMouseOverHandler}
        onMouseOut={onMouseOutHandler}
        onClick={onClickHandler}
      >
        <Flex
          __css={containerStyle}
          sx={dynamicStyle}
          _hover={{
            backgroundColor:
              task.taskType == "TODO" ? "brand.green.300" : "brand.regular",
          }}
          onTouchStart={() => {
            timerId = setTimeout(() => setLongTouch(true), 500);
          }}
          onTouchEnd={() => {
            clearTimeout(timerId);
            if (longTouch) {
              setLongTouch(false);
              setShowDescriptionForm(true);
            }
          }}
        >
          {blockDecorationLine}
          {label}
        </Flex>
        <Flex>{showButtons && buttons}</Flex>
      </Rnd>
    );

    //#endregion

    // #region TaskForm
    const [showTaskForm, setShowTaskForm] = useState(false);

    const onTaskFormSubmit = useCallback(() => {
      setShowTaskForm(false);
    }, []);
    const onTaskFormCancel = useCallback(() => {
      setShowTaskForm(false);
    }, []);

    const taskForm = showTaskForm && (
      <TaskForm
        isUpdateForm={true}
        task={task}
        onSubmit={onTaskFormSubmit}
        onCancel={onTaskFormCancel}
      />
    );
    //#endregion

    // #region DescriptionForm

    const [showDescriptionForm, setShowDescriptionForm] = useState(false);

    const descriptionForm = showDescriptionForm && (
      <TaskDescription task={task} setShow={setShowDescriptionForm} />
    );

    //#endregion

    return (
      <>
        {taskForm}
        {descriptionForm}
        {block}
      </>
    );
  };
export default TaskBlock;
