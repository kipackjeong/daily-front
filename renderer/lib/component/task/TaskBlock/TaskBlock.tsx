import { Flex, useStyleConfig } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DraggableData, Rnd } from "react-rnd";
import DeleteButton from "../../../../core/components/DeleteButton";
import {
  ITask,
  taskService,
  taskActions,
  selectSelectedTasks,
} from "../../../models/task";
import {
  convertTimeIntervalToPxHeight,
  convertPXtoMinute,
} from "../../../utils/converter";
import { getPositionFromStartTime } from "../../../utils/helper";
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
    console.log("TaskBlock render");

    const dispatch = useDispatch();
    const selectedTasks = useSelector(selectSelectedTasks);

    const [height, setHeight] = useState<string>(
      `${
        convertTimeIntervalToPxHeight(task.timeInterval) == 0
          ? 1
          : convertTimeIntervalToPxHeight(task.timeInterval)
      }px`
    );

    const [positionY, setPositionY] = useState(
      getPositionFromStartTime(task.timeInterval)
    );

    const thisTaskSelected = selectedTasks.includes(task._id);

    // #region Adding Task

    // #endregion

    // #region Delete Button

    const [showDeleteBtn, setShowDeleteBtn] = useState(thisTaskSelected);

    useEffect(() => {
      setShowDeleteBtn(thisTaskSelected);
    }, [thisTaskSelected]);

    function onMouseOverHandler() {
      setShowDeleteBtn(true);
    }

    function onMouseOutHandler() {
      if (!thisTaskSelected) {
        setShowDeleteBtn(false);
      }
    }

    const onDeleteBtnClickHandler = useCallback(async () => {
      await taskService.deleteTask(task, dispatch);
    }, [task]);

    const deleteBtn = (
      <DeleteButton
        style={{
          position: "absolute",
          height: "100%",
          right: "0px",
          border: "none",
          zIndex: 2,
          borderRadius: 0,
        }}
        onClick={onDeleteBtnClickHandler}
      />
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
    const [showLabels, setShowLabels] = useState(false);

    useEffect(() => {
      console.log("TaskBlock -- useMemo for showLabels");
      if (height !== "1px" && height != "0px" && height != "0") {
        setShowLabels(true);
      }
    }, [height]);

    const label = <TaskBlockLabel task={task} height={height} />;
    // #endregion

    // #region Block

    // sets block's height by task's timeinterval
    useEffect(() => {
      setHeight(`${convertTimeIntervalToPxHeight(task.timeInterval)}`);
    }, [
      task.timeInterval.endTime.getTime(),
      task.timeInterval.startTime.getTime(),
    ]);
    const containerStyle = useStyleConfig("Flex", { variant: "taskBlockBox" });

    const blockBGColor = thisTaskSelected
      ? task.taskType == "TODO"
        ? "brand.green.600"
        : "brand.heavy"
      : task.taskType == "TODO"
      ? "brand.green.200"
      : "brand.lightGray";

    const dynamicStyle = {
      border: !showLabels && "1px solid #1D2D44",
      backgroundColor: blockBGColor,
      color: thisTaskSelected && "white",
    };

    async function onResizeStopHandler(e, direction, ref, delta, position) {
      console.log("TaskBlock - onResizeStopHandler:");
      console.log("--direction: " + direction);
      console.log("--height: " + ref.style.height);

      e.preventDefault();

      const updateTask = { ...task };
      const { startTime, endTime } = updateTask.timeInterval;

      if (direction == "top") {
        // console.log("--element:");
        // console.log(e);
        // console.log("--delta:");
        // console.log(delta);
        // console.log("--position:");
        // console.log("----position before: " + positionY);
        // console.log("----position after: " + position.y);

        // top direction resizing
        setPositionY(position.y);
        setHeight(ref.style.height);

        const yDiff = position.y - positionY;
        const minutesToDecrease = convertPXtoMinute(yDiff);

        startTime.setMinutes(startTime.getMinutes() + minutesToDecrease);
      } else {
        // bottom direction resizing
        setHeight(ref.style.height);

        let minuteToAdd = convertPXtoMinute(delta.height);

        endTime.setMinutes(endTime.getMinutes() + minuteToAdd);
      }

      await taskService.updateTask(updateTask, dispatch);
    }

    const onDragStopHandler = useCallback(
      (e: DragEvent, d: DraggableData) => {
        e.preventDefault();

        const updateTask = { ...task };

        const yDiff = d.lastY - positionY;

        // to prevent onclick being notified as drag.
        if (Math.abs(yDiff) < 5) {
          return;
        }

        const minuteToAdd = convertPXtoMinute(yDiff);
        setPositionY(d.lastY);

        // change the Task's interval
        const { startTime, endTime } = updateTask.timeInterval;
        startTime.setMinutes(startTime.getMinutes() + minuteToAdd);
        endTime.setMinutes(endTime.getMinutes() + minuteToAdd);

        taskService.updateTask(updateTask, dispatch);
      },
      [positionY, task]
    );

    const onClickHandler = useCallback(
      async (e) => {
        console.log("TaskBlock -- onClickHandler");
        console.log(task.category);
        e.preventDefault();

        if (e.detail == 2) {
          // double click
          // show description/edit form
          if (task.title) {
            setShowDescriptionForm(true);
          } else {
            setShowTaskForm(true);
          }
        } else {
          // one click
          console.log("-- clicked taskblock with task id: " + task._id);

          // if selected with ctr key down, that means selecting multiple.
          if (e.nativeEvent.ctrlKey) {
            dispatch(taskActions.multiSelectTask(task._id));

            return;
          }

          // update redux
          if (!thisTaskSelected) {
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
        }}
        size={{ width: "95%", height: height }}
        position={{ x: 32, y: positionY }}
        onDragStop={onDragStopHandler}
        onResizeStop={onResizeStopHandler}
        onMouseOver={onMouseOverHandler}
        onMouseOut={onMouseOutHandler}
        onClick={onClickHandler}
      >
        <Flex __css={containerStyle} sx={dynamicStyle}>
          {blockDecorationLine}
          {showLabels && label}
        </Flex>

        {showDeleteBtn && deleteBtn}
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
