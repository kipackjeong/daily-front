import { Box, Flex, position, Tooltip, useStyleConfig } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { DraggableData, Rnd } from "react-rnd";
import CheckButton from "../../../../core/components/CheckButton";
import DeleteButton from "../../../../core/components/DeleteButton";
import IconButton from "../../../../core/components/IconButton";
import UndoButton from "../../../../core/components/UndoButton";
import { useUISetting } from "../../../hooks/useUISettings";
import {
  ITask,
  taskService,
  taskActions,
  selectSelectedTasks,
  selectTasks,
} from "../../../models/task";
import {
  convertTimeIntervalToPxHeight,
  convertPXtoMinute,
  convertPXtoSeconds,
  addSeconds,
  adjustIntervalToStartAfter,
  adjustIntervalToStartBefore,
  findOverlappedTask,
  getPositionFromStartTime,
} from "../../../utils/helper";
import { pixelPerMinute } from "../../timetables/constant";
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

    const { pixelPerHour } = useUISetting();

    const [height, setHeight] = useState<string>(
      `${
        convertTimeIntervalToPxHeight(task.timeInterval, pixelPerHour) == 0
          ? 1
          : convertTimeIntervalToPxHeight(task.timeInterval, pixelPerHour)
      }px`
    );

    const [heightDiff, setHeightDiff] = useState(0);

    const [positionY, setPositionY] = useState(
      getPositionFromStartTime(task.timeInterval, pixelPerHour)
    );

    const taskSelected = selectedTasks.includes(task._id);

    // #region Adding Task

    // #endregion

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
      await taskService.deleteTask(task, dispatch);
    }, [task]);

    const checkBtn =
      task.taskType == "TODO" ? (
        <CheckButton
          style={{ padding: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            taskService.updateTask({ ...task, taskType: "DID" }, dispatch);
            dispatch(taskActions.resetSelectedTask);
          }}
          _hover={{ color: "brand.light" }}
        />
      ) : (
        <UndoButton
          style={{ padding: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            taskService.updateTask({ ...task, taskType: "TODO" }, dispatch);
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
          right: "0px",
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
    }, [task.timeInterval, pixelPerHour]);

    // sets block's height by task's timeinterval
    useEffect(() => {
      setHeight(
        `${convertTimeIntervalToPxHeight(task.timeInterval, pixelPerHour)}`
      );
    }, [task, positionY, heightDiff, pixelPerHour]);

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
      if (direction == "top") {
        // console.log("--element:");
        // console.log(e);
        // console.log("--delta:");
        // console.log(delta);
        // console.log("--position:");
        // console.log("----position before: " + positionY);
        // console.log("----position after: " + position.y);

        // top direction resizing

        console.log("position.y: " + position.y);
        console.log("positionY: " + positionY);

        const yDiff = position.y - positionY;

        if (Math.abs(yDiff) >= pixelPerMinute) {
          const minutesToDecrease = convertPXtoMinute(yDiff, pixelPerHour);
          setPositionY(position.y);
          task.timeInterval.startTime.setMinutes(
            task.timeInterval.startTime.getMinutes() + minutesToDecrease
          );
        }
      } else {
        // bottom direction resizing

        const pxToAdd = delta.height - heightDiff;

        if (Math.abs(pxToAdd) >= pixelPerMinute) {
          const minutesToAdd = convertPXtoMinute(pxToAdd, pixelPerHour);
          setHeightDiff(delta.height);

          task.timeInterval.endTime.setMinutes(
            task.timeInterval.endTime.getMinutes() + minutesToAdd
          );
        }
      }
    }

    async function onResizeStopHandler(e, direction, ref, delta, position) {
      setHeightDiff(0);
      await taskService.updateTask(task, dispatch);
    }

    const onDragHandler = (e: DragEvent, d: DraggableData) => {
      e.preventDefault();

      // console.log("positionY: " + positionY);
      // console.log("d: ");
      // console.log(d);

      let yd = d.y - positionY;

      if (Math.abs(yd) >= pixelPerMinute) {
        setPositionY(d.y);
        const secondsToAdd = convertPXtoSeconds(yd, pixelPerHour);

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

        taskService.updateTask(updatedTask, dispatch);
      }

      // if (overlappedTask) {
      //   console.log("overlappedTask.title: " + overlappedTask.title);
      //   // find out direction of snapping by comparing startTime gap with endTime gap between dragging task and overlapping task.

      //   tasks.find((t, i) => {
      //     const currentTask = t;
      //     console.log(
      //       "currentTask.timeInterval.startTime: " +
      //         currentTask.timeInterval.startTime
      //     );
      //     console.log(
      //       "currentTask.timeInterval.endTime: " +
      //         currentTask.timeInterval.endTime
      //     );
      //     let nextTask;
      //     if (i < tasks.length - 1) nextTask = tasks.at(i + 1);

      //     const gap =
      //       currentTask.timeInterval.endTime.getTime() -
      //       nextTask.timeInterval.startTime.getTime();
      //   });

      //   // while (overlappedTask) {
      //   overlappedTask = { ...overlappedTask };
      //   console.log("direction: " + direction);
      //   // case when task should be setted above the overlapped task.
      //   if (direction == "up") {
      //     updatedTask = adjustIntervalToStartBefore(
      //       updatedTask,
      //       overlappedTask
      //     );
      //   } else {
      //     updatedTask = adjustIntervalToStartAfter(updatedTask, overlappedTask);
      //   }

      //   overlappedTask = findOverlappedTask(tasks, updatedTask);
      //   // }
      // }

      // prevents onclick triggering ondragstop
      if (d.y != positionY) {
        taskService.updateTask(updatedTask, dispatch);
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

    const block = (
      <Rnd
        className="task-block_rnd"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
          padding: 0,
          borderWidth: "0.1px",
          borderBlockStyle: "ridge",
          borderColor: "brand.heavy",
        }}
        size={{ width: "90%", height: height }}
        position={{ x: 60, y: positionY }}
        onResize={onResizeHandler}
        onDrag={onDragHandler}
        onDragStop={onDragStopHandler}
        onResizeStop={onResizeStopHandler}
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
