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
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import IconButton from "../../../../core/components/IconButton";
import ModalLayout from "../../../../core/layouts/ModalLayout";
import ICategory from "../../../models/category/category.interface";
import categoryService from "../../../models/category/category.service";
import { ITask, taskService } from "../../../models/task";
import Category from "../../category/Category";

import { FocusLevelSlider, TimePicker } from "../TaskForm/atoms";
import CategorySelection from "../TaskForm/atoms/CategorySelection";
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

  const dispatch = useDispatch();

  function onClose() {
    setShow(false);
  }

  // #region Duration
  const [startTime, setStartTime] = useState<Date>(
    new Date(task ? task.timeInterval.startTime : Date.now() + 10)
  );

  const [endTime, setEndTime] = useState<Date>(
    new Date(task ? task.timeInterval.endTime : Date.now() + 10)
  );

  function onStartTimeChangeHandler(hour, minute) {
    setStartTime((prev) => {
      prev.setHours(hour);
      prev.setMinutes(minute);
      return prev;
    });
  }

  function onEndTimeChangeHandler(hour, minute) {
    setEndTime((prev) => {
      prev.setHours(hour);
      prev.setMinutes(minute);
      return prev;
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
  const [taskType, setTaskType] = useState("TODO");

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
      id="title"
      className="title-input"
      isRequired
    >
      <FormLabel fontSize="lg">Title</FormLabel>
      <Editable
        fontSize="lg"
        textAlign={"center"}
        defaultValue={task.title}
        ref={titleRef}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
    </FormControl>
  );
  // #endregion

  // #region Description
  const descriptionRef = useRef<HTMLInputElement>();

  const descriptionSection = task && (
    <FormControl
      {...style.formControl}
      id="title"
      className="description-input"
    >
      <FormLabel>Description</FormLabel>
      <Editable
        ref={descriptionRef}
        fontSize="lg"
        w="100%"
        textAlign={"center"}
        defaultValue={task.description ? task.description : "---"}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
    </FormControl>
  );
  // #endregion

  // #region Category Selection
  const [showCategorySelection, setShowCategorySelection] = useState(false);
  const [category, setCategory] = useState(task.category);

  function onCategoryPlusClicked() {
    setShowCategorySelection(true);
  }
  function onCategorySelectCancelHandler() {
    setShowCategorySelection(false);
  }
  async function onCategorySelectHandler(categoryId) {
    setShowCategorySelection(false);
    const newlySelectedCategory = await categoryService.findById(categoryId);

    setCategory(newlySelectedCategory);
  }

  const categorySelection = (
    <FormControl
      {...style.formControl}
      id="title"
      className="description-input"
    >
      <FormLabel>Category</FormLabel>
      <Flex alignItems="center" justifyContent="center">
        {task && category ? (
          <Category category={category as ICategory} />
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
    const payload = {
      ...task,
      title: titleRef.current.textContent,
      description: descriptionRef.current.textContent,
      timeInterval: {
        startTime,
        endTime,
      },
      taskType: taskType,
      category: category,
      focusLevel: Number(focusLevelRef.current.value),
    };

    await taskService.updateTask(payload, dispatch);

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
          height="650px"
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
