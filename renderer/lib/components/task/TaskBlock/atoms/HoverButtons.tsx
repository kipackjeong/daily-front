import {
  ButtonProps,
  Flex,
  Slide,
  SlideFade,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import CheckButton from "@core/components/buttons/CheckButton";
import DeleteButton from "@core/components/buttons/DeleteButton";
import UndoButton from "@core/components/buttons/UndoButton";
import { useAppStatus } from "@lib/hooks//useAppStatus";
import useMediaSize from "@lib/hooks//useMediaSize";
import { taskActions } from "@lib/models/task";
import taskLocalService from "../../../../services/task/task.local-service";
import taskService from "@lib/services/task/task.service";

type HoverButtonsProps = { parentHeight; task; isOpen; isMini? } & ButtonProps;

const HoverButtons = ({
  parentHeight,
  task,
  isOpen,
  isMini = false,
  ...rest
}: HoverButtonsProps) => {
  const { isOnline } = useAppStatus();
  const dispatch = useDispatch();
  const { isMD, isSM } = useMediaSize();

  const onDeleteBtnClickHandler = useCallback(async () => {
    isOnline
      ? await taskService.delete(task, dispatch)
      : await taskLocalService.delete(task._id, dispatch);
  }, [task]);

  const checkButtonClickHandler = async (e) => {
    e.stopPropagation();

    const payload = { ...task, taskType: "Did" };
    isOnline
      ? await taskService.update(payload, dispatch)
      : await taskLocalService.update(payload, dispatch);
  };

  const doneButtonClickHandler = async (e) => {
    const payload = { ...task, taskType: "To Do" };

    e.stopPropagation();
    isOnline
      ? await taskService.update(payload, dispatch)
      : await taskLocalService.update(payload, dispatch);
    dispatch(taskActions.resetSelectedTask);
  };

  const checkBtn =
    task.taskType == "To Do" ? (
      <CheckButton
        padding={0}
        size={isMini && isMD ? "xs" : "sm"}
        onClick={checkButtonClickHandler}
        color={isMini ? "brand.heavy" : "white"}
        _hover={{ color: isMini ? "brand.green.300" : "brand.green.200" }}
      />
    ) : (
      <UndoButton
        padding={0}
        size={isMini && isMD ? "xs" : "sm"}
        onClick={doneButtonClickHandler}
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

  return (
    <SlideFade
      className="hover-buttons_slide"
      in={isOpen}
      offsetY={0}
      offsetX={10}
      style={{
        height: "50%",
        width: "1px",
        position: "absolute",
        left: "86%",
        display: "flex",
        alignItems: "center",
        zIndex: 10,
        paddingTop: 4,
      }}
      unmountOnExit={true}
    >
      {checkBtn}
      {deleteBtn}
    </SlideFade>
  );
};

export default HoverButtons;
