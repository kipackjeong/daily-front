import {
  Box,
  Flex,
  position,
  Tooltip,
  useMediaQuery,
  useStyleConfig,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { DraggableData, Rnd } from "react-rnd";
import CheckButton from "../../../../core/components/CheckButton";
import DeleteButton from "../../../../core/components/DeleteButton";
import IconButton from "../../../../core/components/IconButton";
import UndoButton from "../../../../core/components/UndoButton";
import { useAppStatus } from "../../../hooks/useAppStatus";
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
};

const TaskBlock =
  /**
   * A Block that represents a task in the time table.
   *
   * @param {TaskBlockProps} { task }
   * @returns {*}
   */
  ({ task }: TaskBlockProps) => {
    // console.log("TaskBlock render");

    const dispatch = useDispatch();
    const selectedTasks = useSelector(selectSelectedTasks);
    const tasks = useSelector(selectTasks);
    const { isOnline } = useAppStatus();

    const { pixelPerHour, pixelPerMinute } = useUISetting();

    const [height, setHeight] = useState<number>(
      convertTimeIntervalToPxHeight(task.timeInterval, pixelPerHour) == 0
        ? 1
        : convertTimeIntervalToPxHeight(task.timeInterval, pixelPerHour)
    );

    const [heightDiff, setHeightDiff] = useState(0);

    const [positionY, setPositionY] = useState(
      getPositionFromStartTime(task.timeInterval, pixelPerHour)
    );

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
          style={{ padding: 0 }}
          onClick={async (e) => {
            e.stopPropagation();

            const payload = { ...task, taskType: "DID" };
            isOnline
              ? await taskService.update(payload, dispatch)
              : await taskLocalService.update(payload, dispatch);
          }}
          _hover={{ color: "brand.light" }}
        />
      ) : (
        <UndoButton
          style={{ padding: 0 }}
          onClick={async (e) => {
            const payload = { ...task, taskType: "TODO" };

            e.stopPropagation();
            isOnline
              ? await taskService.update(payload, dispatch)
              : await taskLocalService.update(payload, dispatch);
            dispatch(taskActions.resetSelectedTask);
          }}
        />
      );
    const deleteBtn = (
      <DeleteButton style={{ padding: 0 }} onClick={onDeleteBtnClickHandler} />
    );

    const buttons = (
      <Flex
        style={{
          position: "absolute",
          height: "100%",
          right: "2%",
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
      />
    );
    // #endregion

    // #region Block

    useEffect(() => {
      setPositionY(getPositionFromStartTime(task.timeInterval, pixelPerHour));
    }, [tasks, pixelPerHour]);

    // sets block's height by task's timeinterval
    useEffect(() => {
      setHeight(convertTimeIntervalToPxHeight(task.timeInterval, pixelPerHour));
    }, [tasks, pixelPerHour]);

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
      setHeightDiff(0);
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
        console.log(taskToAttachTo.title);
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
          // show description/edit form
          if (task.title) {
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

    const [isBase, isSM, isMD, isLG, isXL] = useMediaQuery([
      "(min-width: 0em) and (max-width: 29em)",
      "(min-width: 30em) and (max-width: 47em)",
      "(min-width: 48em) and (max-width: 61em)",
      "(min-width: 62em) and (max-width: 79em)",
      "(min-width: 80em) ",
    ]);

    let width = useMemo(() => {
      if (isXL) {
        return "94.7%";
      }
      if (isLG) {
        return "93.5%";
      }
      if (isMD) {
        return "90.7%";
      }
      if (isSM) {
        return "88%";
      }
      if (isBase) {
        return "88%";
      }
      return "95%";
    }, [isBase, isSM, isMD, isLG, isXL]);

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
        position={{ x: 60, y: positionY }}
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
          onTouchEnd={onClickHandler}
        >
          {blockDecorationLine}
          {label}
        </Flex>

        {showButtons && buttons}
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
