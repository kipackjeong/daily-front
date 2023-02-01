import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  useStyleConfig,
} from "@chakra-ui/react";
import { Scrollbars } from "react-custom-scrollbars";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalLayout from "../../../../core/layouts/ModalLayout";
import { ITask, taskService } from "../../../models/task";
import { FocusLevelSlider } from "./atoms";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import TimePicker from "./atoms/TimePicker";
import CategorySelection from "./atoms/CategorySelection";
import style from "./style";
import TaskTypeRadio from "./atoms/TaskTypeRadio";
import { selectDate } from "../../../redux/slices/date.slice";
import { setFips } from "crypto";
import { selectLatestTask } from "../../../redux/slices/task.slice";
import taskLocalService from "../../../models/task/task.local-service";
import { useAppStatus } from "../../../hooks/useAppStatus";

export interface RadioRef extends HTMLDivElement {
  value: string;
}
export interface FocusLevelRef extends HTMLDivElement {
  value: string;
}

type TaskFormProps = {
  task?: ITask;
  setTask?;
  onCancel?;
  onSubmit?;
  isUpdateForm?: boolean;
};

const TaskForm = ({
  task,
  setTask,
  onCancel,
  onSubmit,
  isUpdateForm = false,
}: TaskFormProps) => {
  console.log("TaskForm - render");

  // #region Hooks
  const titleRef = useRef<HTMLInputElement>();
  const descriptionRef = useRef<HTMLInputElement>();
  const focusLevelRef = useRef<FocusLevelRef>();
  const [taskType, setTaskType] = useState(task.taskType);
  const [selectedCategory, setSelectedCategory] = useState(task.category);
  const [startTime, setStartTime] = useState<Date>(
    new Date(task ? task.timeInterval.startTime : Date.now() + 10)
  );

  const [endTime, setEndTime] = useState<Date>(
    new Date(task ? task.timeInterval.endTime : Date.now() + 10)
  );

  const { isOnline } = useAppStatus();

  const dispatch = useDispatch();

  // #endregion

  // #region Handlers
  async function onSubmitHandler(e): Promise<void> {
    e.preventDefault();

    console.log("TaskForm - onSubmitHandler");
    // case when creating new task
    console.log("--Create Task");

    let timeInterval = {
      startTime,
      endTime,
    };

    if (startTime > endTime) {
      const temp = startTime;
      timeInterval.startTime = endTime;
      timeInterval.endTime = temp;
    }
    
    console.log("task: ");
    const createPayload: ITask = {
      ...task,
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      focusLevel: Number(focusLevelRef.current.value),
      timeInterval,
      taskType: taskType,
      category: selectedCategory,
    };

    isUpdateForm
      ? isOnline
        ? await taskService.update(createPayload, dispatch)
        : await taskLocalService.update(createPayload, dispatch)
      : isOnline
      ? await taskService.create(createPayload, dispatch)
      : await taskLocalService.create(createPayload, dispatch);

    onSubmit();
  }

  function onClose() {
    onCancel();
  }
  function onCancelClickHandler() {
    onCancel();
  }

  function onStartTimeChangeHandler(hour, minute) {
    setStartTime((prev) => {
      const newState = new Date(prev);
      console.log("TaskForm - onStartTimeChangeHandler - setStartTime");
      newState.setHours(hour);
      newState.setMinutes(minute);
      return newState;
    });
  }

  function onEndTimeChangeHandler(hour, minute) {
    setEndTime((prev) => {
      const newState = new Date(prev);
      console.log("TaskForm - onEndTimeChangeHandler - setEndTime");
      newState.setHours(hour);
      newState.setMinutes(minute);
      return newState;
    });
  }

  function onTaskTypeRadioChange(value) {
    setTaskType(value);
  }

  async function onCategorySelect(categoryId) {
    setSelectedCategory(categoryId);
  }
  // #endregion

  //#region Styles
  const flexStyle = useStyleConfig("Flex");
  //#endregion

  //#region Components

  const taskTypeRadio = (
    <TaskTypeRadio value={task.taskType} onChange={onTaskTypeRadioChange} />
  );

  const timePicker = (
    <TimePicker
      startTime={startTime}
      endTime={endTime}
      onStartTimeChange={onStartTimeChangeHandler}
      onEndTimeChange={onEndTimeChangeHandler}
      setTime={undefined}
    />
  );

  const formInputs = (
    <>
      <FormControl
        {...style.formControl}
        variant="floating"
        id="title"
        className="title-input"
        isRequired
      >
        <Input
          ref={titleRef}
          width="100%"
          placeholder=" "
          defaultValue={task.title}
        />
        <FormLabel>Title</FormLabel>
      </FormControl>
      <FormControl
        {...style.formControl}
        id="description"
        className="description-input"
        variant="floating"
        isInvalid={false}
      >
        <Input
          ref={descriptionRef}
          width="100%"
          placeholder=" "
          defaultValue={task.description}
        />
        <FormLabel>Description </FormLabel>
      </FormControl>
    </>
  );

  const categorySelect = (
    <CategorySelection
      onSelect={onCategorySelect}
      selectedCategory={selectedCategory}
    />
  );

  const focusLevelSlider = (
    <FormControl {...style.formControl}>
      <FocusLevelSlider
        focusLevelRef={focusLevelRef}
        defaultValue={task && task.focusLevel}
      />
    </FormControl>
  );
  const buttons = (
    <ButtonGroup pt={"45px"} width="22rem" justifyContent="space-evenly">
      <Button type="submit" variant="solid">
        Save
      </Button>
      <Button variant="unstyled" onClick={onCancelClickHandler}>
        Cancel
      </Button>
    </ButtonGroup>
  );
  //#endregion
  return (
    <>
      <ModalLayout
        title="Create Task"
        width="550px"
        height="650px"
        haveButton={false}
        show={true}
        onClose={onClose}
      >
        <Scrollbars autoHide={true}>
          <form
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onSubmit={onSubmitHandler}
          >
            <Flex width="80%" flexDir={"column"} alignItems="center">
              {timePicker}
              {taskTypeRadio}
              {formInputs}
              {categorySelect}
              {focusLevelSlider}
              {buttons}
            </Flex>
          </form>
        </Scrollbars>
      </ModalLayout>
    </>
  );
};
export default TaskForm;
