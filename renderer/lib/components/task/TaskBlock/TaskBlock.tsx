import {
  Card,
  Flex,
  useStyleConfig,
  Text,
  SlideFade,
  Portal,
} from "@chakra-ui/react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { DraggableData, Rnd } from "react-rnd";
import { useAppStatus } from "../../../hooks/useAppStatus";
import useMediaSize from "../../../hooks/useMediaSize";
import { useUISetting } from "../../../hooks/useUISettings";
import { ITask } from "@lib/models/task";
import taskLocalService from "../../../services/task/task.local-service";
import {
  convertTimeIntervalToPxHeight,
  convertPXtoSeconds,
  addSeconds,
  adjustIntervalToStartAfter,
  adjustIntervalToStartBefore,
  findOverlappedTask,
  getPositionFromStartTime,
  toPrecision,
} from "@core/utils/helper";
import TaskDescription from "../TaskDescription/TaskDescription";
import TaskForm from "../TaskForm/TaskForm";
import TaskBlockLabel from "./atoms/TaskBlockLabel";
import {
  selectSelectedTasks,
  selectTasks,
  taskActions,
} from "@lib/redux/slices/task.slice";
import taskService from "@lib/services/task/task.service";
import SideButtons from "./atoms/SideButtons";
import BlockDecorationLine from "./atoms/BlockDecorationLine";
import useTaskBlock from "@lib/hooks/useTaskBlock";

type TaskBlockProps = {
  task: ITask;
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
    const {
      onMouseOverHandler,
      onMouseOutHandler,
      onResizeHandler,
      onResizeStopHandler,
      onDragHandler,
      onDragStopHandler,
      onClickHandler,
      onTaskFormSubmit,
      onTaskFormCancel,
      onTouchStartHandler,
      onTouchEndHandler,
      setShowDescriptionForm,
      taskSelected,
      positionY,
      height,
      taskBlockRef,
      showSideButtons,
      showTaskForm,
      showDescriptionForm,
    } = useTaskBlock({ task, isMini });

    const { isBase, isSM, isMD, isLG, isXL } = useMediaSize();

    const containerStyle = {
      zIndex: 2,
      position: "absolute",
      w: "100%",
      height: "100%",
      display: "flex",
      flexDir: "column",
      color: "brand.heavy",
      cursor: "pointer",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
      backgroundColor: taskSelected
        ? task.taskType == "To Do"
          ? "brand.green.100"
          : "brand.blue.100"
        : "white",
      _hover: {
        backgroundColor:
          task.taskType == "To Do" ? "brand.green.100" : "brand.blue.100",
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
    return (
      <>
        {showTaskForm && (
          <TaskForm
            isUpdateForm={true}
            task={task}
            onSubmit={onTaskFormSubmit}
            onCancel={onTaskFormCancel}
          />
        )}

        {showDescriptionForm && (
          <TaskDescription task={task} setShow={setShowDescriptionForm} />
        )}

        <Rnd
          className="TaskBlock__rnd"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
            padding: 0,
            borderBlockStyle: "solid",
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
            className="TaskBlock__rnd__body"
            id={"task-block-" + task._id}
            ref={taskBlockRef}
            sx={containerStyle}
            onTouchStart={onTouchStartHandler}
            onTouchEnd={onTouchEndHandler}
          >
            <BlockDecorationLine taskType={task.taskType} />
            <TaskBlockLabel
              isMini={isMini}
              task={task}
              height={height}
              color="brand.heavy"
              fontSize={{
                base: "3xs",
                sm: "2xs",
                md: "xs",
                lg: "md",
                xl: "md",
              }}
            />
            <Flex>
              {showSideButtons && (
                <SideButtons
                  taskBlockRef={taskBlockRef}
                  task={task}
                  isMini={isMini}
                />
              )}
            </Flex>
          </Flex>
        </Rnd>
      </>
    );
  };
export default TaskBlock;
