import {
  Text,
  Card,
  CardBody,
  Flex,
  Tag,
  TagLabel,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { taskService } from "../../../models/task";
import { Scrollbars } from "react-custom-scrollbars";
import { useAppStatus } from "../../../hooks/useAppStatus";
import taskLocalService from "../../../models/task/task.local-service";

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();

  const [madeChanges, setMadeChanges] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [changedPriority, setChangedPriority] = useState(task.priority);

  const { isOnline } = useAppStatus();

  // Sets the starting poisition of the scroll.
  useEffect(() => {
    setIsUpdating(true);
    setChangedPriority(task.priority);
    // this is the actual div element of Scrollbars component
    const parent = document.getElementById("t-priority-scrollbar-" + task._id);

    // get it's child
    const child = parent.firstChild as HTMLDivElement;
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

    child.scrollTo({ top: thisPriorityTabPosition, behavior: "smooth" });
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

  return isUpdating ? (
    <Spinner />
  ) : (
    <Card onMouseLeave={cardMouseLeaveHandler}>
      <CardBody
        p={2}
        borderWidth={1}
        borderColor={colors[task.priority]}
        display="flex"
        flexDir={"row"}
        columnGap={5}
      >
        {/* TODO: currently when I hover over the priority label it sets to Priority:High.  */}
        <Scrollbars
          id={"t-priority-scrollbar-" + task._id}
          className={"task-priority-scrollbar"}
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
              // );
            })}
          </Flex>
        </Scrollbars>
        <Text fontSize={"sm"}>{task.detail}</Text>
      </CardBody>
    </Card>
  );
};

export default TaskCard;