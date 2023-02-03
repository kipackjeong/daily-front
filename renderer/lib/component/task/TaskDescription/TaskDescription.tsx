import {
  Flex,
  Button,
  ButtonGroup,
  FormLabel,
  Editable,
  EditablePreview,
  EditableInput,
  VStack,
  FormControl,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import IconButton from "../../../../core/components/IconButton";
import ModalLayout from "../../../../core/layouts/ModalLayout";
import { useAppStatus } from "../../../hooks/useAppStatus";
import categoryLocalService from "../../../models/category/category.local-service";
import categoryService from "../../../models/category/category.service";
import { ITask, taskService } from "../../../models/task";
import taskLocalService from "../../../models/task/task.local-service";
import Category from "../../category/Category";

import { FocusLevelSlider, TimePicker } from "../TaskForm/atoms";
import CategorySelection from "../TaskForm/atoms/CategorySelection";
import PriorityRadioCard from "../TaskForm/atoms/PriorityRadioCard";
import TaskTypeRadio from "../TaskForm/atoms/TaskTypeRadio";
import style from "../TaskForm/style";
import { FocusLevelRef } from "../TaskForm/TaskForm";

type TaskDescriptionProps = {
  task: ITask;
  setShow;
  setTask?;
};

const TaskDescription = ({ task, setShow }: TaskDescriptionProps) => {
  console.log("TaskDescription renders");
  const { isOnline } = useAppStatus();

  const dispatch = useDispatch();

  function onClose() {
    setShow(false);
  }

  // #region Duration
  const [startTime, setStartTime] = useState<Date>(
    task ? task.timeInterval.startTime : new Date(Date.now() + 10)
  );

  const [endTime, setEndTime] = useState<Date>(
    task ? task.timeInterval.endTime : new Date(Date.now() + 10)
  );

  function onStartTimeChangeHandler(hour, minute) {
    setStartTime((prev) => {
      const newState = new Date(prev);
      newState.setHours(hour);
      newState.setMinutes(minute);
      return newState;
    });
  }

  function onEndTimeChangeHandler(hour, minute) {
    setEndTime((prev) => {
      const newState = new Date(prev);
      newState.setHours(hour);
      newState.setMinutes(minute);
      return newState;
    });
  }
  const durationSection = task != null && (
    <TimePicker
      startTime={startTime}
      endTime={endTime}
      onStartTimeChange={onStartTimeChangeHandler}
      onEndTimeChange={onEndTimeChangeHandler}
      setTime={undefined}
    />
  );
  // #endregion

  // #region Task Type Section
  const [taskType, setTaskType] = useState(task.taskType);

  function onTaskTypeRadioChange(value) {
    setTaskType(value);
  }

  const taskTypeSection = (
    <TaskTypeRadio value={taskType} onChange={onTaskTypeRadioChange} />
  );

  // #endregion

  // #region Title
  const titleRef = useRef<HTMLInputElement>();

  const titleSection = task != null && (
    <FormControl
      {...style.formControl}
      id="detail"
      className="detail-input"
      isRequired
    >
      <FormLabel fontSize="lg">Title</FormLabel>
      <Editable
        fontSize="lg"
        textAlign={"center"}
        defaultValue={task.detail}
        ref={titleRef}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
    </FormControl>
  );
  // #endregion

  // #region Priority
  const [priority, setPriority] = useState(task.priority);

  function priorityChangeHandler(value) {
    setPriority(value);
  }
  // #endregion
  // #region Description
  const descriptionRef = useRef<HTMLInputElement>();

  const descriptionSection = task && (
    <FormControl
      {...style.formControl}
      id="detail"
      className="reflection-input"
    >
      <FormLabel>Description</FormLabel>
      <Editable
        ref={descriptionRef}
        fontSize="lg"
        w="100%"
        textAlign={"center"}
        defaultValue={task.reflection ? task.reflection : "---"}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
    </FormControl>
  );
  // #endregion

  // #region Category Selection
  const [showCategorySelection, setShowCategorySelection] = useState(false);
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    async function fetchCategory() {
      let category;

      category = isOnline
        ? await categoryService.findById(task.category)
        : await categoryLocalService.findById(task.category);

      setCategory(category);
      setIsLoading(false);
    }
    setIsLoading(true);
    if (task.category) fetchCategory();
  }, []);

  function onCategoryPlusClicked() {
    setShowCategorySelection(true);
  }
  function onCategorySelectCancelHandler() {
    setShowCategorySelection(false);
  }
  async function onCategorySelectHandler(categoryId) {
    setShowCategorySelection(false);
    let newlySelectedCategory;

    newlySelectedCategory = isOnline
      ? await categoryService.findById(categoryId)
      : await categoryLocalService.findById(categoryId);

    setCategory(newlySelectedCategory);
  }

  const categorySelection = (
    <FormControl
      {...style.formControl}
      id="detail"
      className="reflection-input"
    >
      <FormLabel>Category</FormLabel>
      <Flex alignItems="center" justifyContent="center">
        {isLoading ? (
          <Spinner />
        ) : task && category ? (
          <Category category={category} />
        ) : (
          <>
            <IconButton icon={FaPlus} onClick={onCategoryPlusClicked} />
            {showCategorySelection && (
              <ModalLayout
                noHeader={true}
                show={true}
                width="350px"
                height="200px"
                onClose={onCategorySelectCancelHandler}
              >
                <CategorySelection
                  onSelect={onCategorySelectHandler}
                  selectedCategory={undefined}
                  height="170px"
                />
              </ModalLayout>
            )}
          </>
        )}
      </Flex>
    </FormControl>
  );

  // #endregion

  // #region Focus Level
  const focusLevelRef = useRef<FocusLevelRef>();
  const focusLevelSection = task && (
    <>
      <FocusLevelSlider
        focusLevelRef={focusLevelRef}
        defaultValue={task.focusLevel}
      />
    </>
  );
  // #endregion

  // #region Buttons
  function onCancelHandler() {
    setShow(false);
  }

  async function onFormSubmitHandler() {
    let timeInterval = {
      startTime,
      endTime,
    };
    if (startTime > endTime) {
      const temp = startTime;
      timeInterval.startTime = endTime;
      timeInterval.endTime = temp;
    }

    const payload = {
      ...task,
      detail: titleRef.current.textContent,
      reflection: descriptionRef.current.textContent,
      timeInterval,
      taskType,
      category: category && category._id,
      focusLevel: Number(focusLevelRef.current.value),
      priority: Number(priority),
    };

    isOnline
      ? await taskService.update(payload, dispatch)
      : await taskLocalService.update(payload, dispatch);

    setShow(false);
  }
  const buttons = (
    <ButtonGroup pt={20} width="22rem" justifyContent="space-evenly">
      <Button variant="solid" onClick={onFormSubmitHandler}>
        Save
      </Button>
      <Button variant="unstyled" onClick={onCancelHandler}>
        Cancel
      </Button>
    </ButtonGroup>
  );
  // #endregion

  return (
    task && (
      <>
        <ModalLayout
          title="Description"
          width="550px"
          height="750px"
          haveButton={false}
          show={true}
          onClose={onClose}
        >
          <Flex
            h="90%"
            w="100%"
            flexDir="column"
            justifyContent="center"
            alignItems="center"
          >
            <VStack
              style={{
                width: "80%",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
              spacing={2}
            >
              {durationSection}
              {taskTypeSection}

              {titleSection}
              {descriptionSection}
              {categorySelection}
              {taskType == "TODO" && (
                <PriorityRadioCard
                  onChange={priorityChangeHandler}
                  defaultValue={priority}
                />
              )}
              {focusLevelSection}
              {buttons}
            </VStack>
          </Flex>
        </ModalLayout>
      </>
    )
  );
};

export default TaskDescription;
