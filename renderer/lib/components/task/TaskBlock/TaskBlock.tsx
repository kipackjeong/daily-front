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
import CheckButton from "@core/components/CheckButton";
import DeleteButton from "@core/components/DeleteButton";
import UndoButton from "@core/components/UndoButton";
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
import { FocusLevelSlider } from "../TaskForm/atoms";
import TaskForm from "../TaskForm/TaskForm";
import TaskBlockLabel from "./atoms/TaskBlockLabel";
import {
  selectSelectedTasks,
  selectTasks,
  taskActions,
} from "@lib/redux/slices/task.slice";
import taskService from "@lib/services/task/task.service";

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
    const [showFocusLevelSlider, setShowFocusLevelSlider] = useState(false);

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

    function onCheckButtonClick(e) {
      e.stopPropagation();
      setShowFocusLevelSlider(true);
    }

    async function onFocusSliderChangeEnd(v) {
      const payload = { ...task, taskType: "Did", focusLevel: v };
      isOnline
        ? await taskService.update(payload, dispatch)
        : await taskLocalService.update(payload, dispatch);

      dispatch(taskActions.resetSelectedTask);
      setShowFocusLevelSlider(false);
    }

    function onFocusSliderMouseOut() {
      setShowFocusLevelSlider(false);
    }

    const checkBtn =
      task.taskType == "To Do" ? (
        <>
          {showFocusLevelSlider && (
            <Portal containerRef={taskBlockRef}>
              <SlideFade
                in={true}
                offsetY={0}
                offsetX={100}
                style={{
                  position: "absolute",
                  top: "-2%",
                  right: "4%",
                  display: "flex",
                  alignItems: "center",
                  zIndex: 10,
                  paddingTop: 4,
                }}
                unmountOnExit={true}
              >
                <Card
                  zIndex={4}
                  position="absolute"
                  w="fit-content"
                  px={2}
                  right={-30}
                  bgColor="brand.green.100"
                  borderColor={"brand.green.250"}
                  onMouseLeave={onFocusSliderMouseOut}
                >
                  <Text fontSize="xs">How much did you focus?</Text>
                  <FocusLevelSlider
                    showMarks={false}
                    showLabel={false}
                    defaultValue={task.focusLevel}
                    levelLabelSize={"sm"}
                    onChangeEnd={onFocusSliderChangeEnd}
                    width={"10em"}
                  />
                </Card>
              </SlideFade>
            </Portal>
          )}

          <CheckButton
            padding={0}
            size={isMini && isMD ? "xs" : "sm"}
            onClick={onCheckButtonClick}
            color="brand.heavy"
            _hover={{ color: "brand.green.300" }}
          />
        </>
      ) : (
        <UndoButton
          pt={1}
          padding={0}
          size={isMini && isMD ? "xs" : "sm"}
          onClick={async (e) => {
            e.stopPropagation();

            const payload = { ...task, taskType: "To Do" };

            isOnline
              ? await taskService.update(payload, dispatch)
              : await taskLocalService.update(payload, dispatch);

            dispatch(taskActions.resetSelectedTask);
          }}
          color="brand.heavy"
          _hover={{ color: "brand.regular" }}
        />
      );
    const deleteBtn = (
      <DeleteButton
        padding={0}
        top={-0.3}
        size={isMini && isMD ? "xs" : "sm"}
        color={"brand.heavy"}
        _hover={{ color: "brand.red.600" }}
        onClick={onDeleteBtnClickHandler}
      />
    );

    const buttons = (
      <Flex
        className="TaskBlock__side-buttons"
        style={{
          position: "absolute",
          right: isMini && isMD && isSM ? "-1%" : "-1%",
          top: "-30px",
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
      task.taskType == "To Do" ? "brand.green.600" : "brand.xRegular";

    const blockDecorationLine = (
      /* TODO: Color should change per priority level */
      <Flex
        className="task-block_left-deco-line"
        height="100%"
        width="0.2%"
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
        isMini={isMini}
        task={task}
        height={height}
        color="brand.heavy"
        fontSize={{ base: "3xs", sm: "2xs", md: "xs", lg: "md", xl: "md" }}
      />
    );
    // #endregion

    // #region Block

    const containerStyle = useStyleConfig("Flex", { variant: "taskBlockBox" });

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
        return isMini ? "95%" : "94.7%";
      }
      if (isLG) {
        return isMini ? "94.5%" : "91.5%";
      }
      if (isMD) {
        return isMini ? "91%" : "90.7%";
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
          id={"task-block-" + task._id}
          ref={taskBlockRef}
          __css={containerStyle}
          sx={dynamicStyle}
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
          <Flex>{showButtons && buttons}</Flex>
        </Flex>
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
