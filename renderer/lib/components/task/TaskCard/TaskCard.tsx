import {
  Text,
  Card,
  CardBody,
  Flex,
  Tag,
  TagLabel,
  Spinner,
  CardProps,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Scrollbars } from "react-custom-scrollbars";
import { useAppStatus } from "../../../hooks/useAppStatus";
import TaskDescription from "../TaskDescription/TaskDescription";
import taskLocalService from "../../../services/task/task.local-service";
import taskService from "@lib/services/task/task.service";
import { getDateStr, getDMMMYYYY } from "@core/utils/helper";

type TaskCardProps = {} & CardProps;

const TaskCard = ({ task, className, ...rest }) => {
  const dispatch = useDispatch();

  const [madeChanges, setMadeChanges] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [changedPriority, setChangedPriority] = useState(task.priority);

  const { isOnline } = useAppStatus();

  // Sets the starting poisition of the scroll.
  useEffect(() => {
    setIsUpdating(true);
    setChangedPriority(task.priority);

    let thisPriorityTabPosition;

    switch (task.priority) {
      case 3: // Low
        thisPriorityTabPosition = 200;
        break;
      case 2: // Med
        thisPriorityTabPosition = 99;
        break;
      case 1: // High
        thisPriorityTabPosition = 0;
        break;
    }
    // this is the actual div element of Scrollbars component
    const elements: HTMLCollectionOf<Element> = document.getElementsByClassName(
      "task-priority-scrollbar-" + task._id
    );

    // get it's child

    let element: Element;
    let child;
    for (var i = 0; i < elements.length; i++) {
      element = elements[i];
      console.log(element);
      child = element.firstChild;
      child.scrollTo({ top: thisPriorityTabPosition, behavior: "smooth" });
    }

    setIsUpdating(false);
  }, [task.priority]);

  /**
   * Place where actual local state (changedPriority) set happens
   */
  function scrollBarsScrollFrameHandler(value) {
    const scrollTop = value.scrollTop;
    switch (scrollTop) {
      case 0:
        if (changedPriority != 1) {
          setChangedPriority(1);
          setMadeChanges(true);
        }

        break;
      case 100:
        if (changedPriority != 2) {
          setChangedPriority(2);
          setMadeChanges(true);
        }
        break;
      case 199:
        if (changedPriority != 3) {
          setChangedPriority(3);
          setMadeChanges(true);
        }
        break;
    }
  }
  /**
   * Where api call happens to update changes.
   */
  async function cardMouseLeaveHandler() {
    // check for update status
    if (madeChanges) {
      // there is update to do

      // call api to update changes
      const payload = { ...task, priority: changedPriority };

      isOnline
        ? await taskService.update(payload, dispatch)
        : await taskLocalService.update(payload, dispatch);

      setMadeChanges(false);
    }
  }

  const colors = {
    1: "brand.red.200",
    2: "brand.yellow.200",
    3: "brand.green.200",
  };

  const options = [
    { label: "High", value: 1 },
    { label: "Med", value: 2 },
    { label: "Low", value: 3 },
  ];

  const [timer, setTimer] = useState(null);
  const [showTaskDescription, setShowTaskDescription] = useState(false);

  const onClickHandler = () => {
    setShowTaskDescription(true);
  };

  const onTouchStartHandler = () => {
    setTimer(setTimeout(() => setShowTaskDescription(true), 1000));
  };

  const onTouchEndHandler = () => {
    setShowTaskDescription(false);
    clearTimeout(timer);
  };

  return isUpdating ? (
    <Spinner />
  ) : (
    <>
      {showTaskDescription && (
        <TaskDescription task={task} setShow={setShowTaskDescription} />
      )}
      <Card
        className={className}
        cursor="pointer"
        onClick={onClickHandler}
        onTouchStart={onTouchStartHandler}
        onTouchEnd={onTouchEndHandler}
        onMouseLeave={cardMouseLeaveHandler}
        {...rest}
      >
        <CardBody
          className={className + "__body"}
          p={2}
          borderWidth={1}
          borderColor={colors[task.priority]}
          display="flex"
          flexDir={"row"}
          columnGap={5}
        >
          <Scrollbars
            className={"task-priority-scrollbar-" + task._id}
            style={{
              width: "3em",
              height: "1.5em",
              overflowX: "hidden",
              overflowY: "hidden",
            }}
            thumbSize={1}
            autoHide={true}
            onScrollFrame={scrollBarsScrollFrameHandler}
          >
            <Flex
              className={"task-priority-tag-" + task._id}
              flexDir={"column"}
              justifyContent="stretch"
              height={"8em"}
              w="100%"
              cursor="pointer"
              rowGap={"59%"}
            >
              {options.map((o) => {
                return (
                  <Tag
                    h="100%"
                    id={o.label}
                    key={o.label}
                    backgroundColor={colors[o.value]}
                    onMouseOver={(e) => {
                      setChangedPriority(o.value);
                    }}
                  >
                    <TagLabel>{o.label}</TagLabel>
                  </Tag>
                );
              })}
            </Flex>
          </Scrollbars>
          <Text className={className + "__body" + "__date"} fontSize={"sm"}>
            {getDMMMYYYY(task.timeInterval.startTime)}
          </Text>
          <Text
            flex={1}
            textAlign="center"
            className={className + "__body" + "__detail"}
            fontSize={"sm"}
          >
            {task.detail}
          </Text>
        </CardBody>
      </Card>
    </>
  );
};

export default TaskCard;
