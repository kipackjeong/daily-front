import { Portal, SlideFade, Card, Flex, Text } from "@chakra-ui/react";
import CheckButton from "@core/components/CheckButton";
import DeleteButton from "@core/components/DeleteButton";
import UndoButton from "@core/components/UndoButton";
import { useAppStatus } from "@lib/hooks/useAppStatus";
import { ITask } from "@lib/models/task";
import { taskActions } from "@lib/redux/slices/task.slice";
import taskLocalService from "@lib/services/task/task.local-service";
import taskService from "@lib/services/task/task.service";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { FocusLevelSlider } from "../../TaskForm/atoms";

type SideButtonsProps = {
  taskBlockRef;
  task: ITask;
  isMini;
};
const SideButtons = ({ taskBlockRef, task, isMini }: SideButtonsProps) => {
  const [showFocusLevelSlider, setShowFocusLevelSlider] = useState(false);
  const { isOnline } = useAppStatus();
  const dispatch = useDispatch();

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
          size={isMini ? "xs" : "sm"}
          onClick={onCheckButtonClick}
          color="brand.heavy"
          _hover={{ color: "brand.green.300" }}
        />
      </>
    ) : (
      <UndoButton
        paddingTop={0.5}
        size={isMini ? "xs" : "sm"}
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
      size={isMini ? "xs" : "sm"}
      color={"brand.heavy"}
      _hover={{ color: "brand.red.600" }}
      onClick={onDeleteBtnClickHandler}
    />
  );

  return (
    <Flex
      className="TaskBlock__side-buttons"
      style={{
        position: "absolute",
        right: "-1%",
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
};

export default SideButtons;
