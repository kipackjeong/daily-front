import {
  AbsoluteCenter,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  chakra,
  Flex,
  FlexProps,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spinner,
  Tag,
  TagLabel,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppStatus } from "../../hooks/useAppStatus";
import { selectTasks, taskService } from "../../models/task";
import { Scrollbars } from "react-custom-scrollbars";
import TaskCard from "../task/TaskCard/TaskCard";
import taskLocalService from "../../models/task/task.local-service";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import Tab from "../../../core/components/Tab";

type PriorityTabProps = {} & FlexProps;

const PriorityTab = (props) => {
  const tasks = useSelector(selectTasks);

  const [topPriorityTasks, setTopPriorityTasks] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const { isOnline } = useAppStatus();

  // Calling api for top 5 may not be needed everytime there is an update on tasks.
  useEffect(() => {
    setIsLoading(true);
    fetchTopFivePrioritizedTasks();

    // GET tasks/?sort=priority&top=5
    async function fetchTopFivePrioritizedTasks() {
      try {
        const tasks = isOnline
          ? await taskService.findTopNByPriorityDescOrder(5)
          : await taskLocalService.findTopNByPriorityDescOrder(5);
        setTopPriorityTasks(tasks);
        setIsLoading(false);
      } catch (error) {}
    }
  }, [tasks]);

  return (
    <Tab
      title={"Priority"}
      isLoading={isLoading}
      defaultIsOpen={true}
      height="15em"
    >
      {topPriorityTasks.map((t) => {
        return <TaskCard task={t} />;
      })}
    </Tab>
  );
};

export default PriorityTab;
