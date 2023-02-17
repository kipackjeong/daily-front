import {
  AbsoluteCenter,
  Card,
  CardBody,
  CardHeader,
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
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppStatus } from "../../../hooks/useAppStatus";
import { selectTasks, taskService } from "../../../models/task";
import { Scrollbars } from "react-custom-scrollbars";
import TaskCard from "../TaskCard/TaskCard";
import taskLocalService from "../../../models/task/task.local-service";

type PriorityTabProps = {} & FlexProps;

const PriorityTab = (props) => {
  const tasks = useSelector(selectTasks);

  const [topPriorityTasks, setTopPriorityTasks] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const { isOnline } = useAppStatus();

  // Calling api for top 5 may not be needed everytime there is an update on tasks.
  useEffect(() => {
    setIsLoading(true);
    // GET tasks/sort=-priority&top=5
    async function fetchTopFivePrioritizedTasks() {
      try {
        const tasks = isOnline
          ? await taskService.findTopNByPriorityDescOrder(5)
          : await taskLocalService.findTopNByPriorityDescOrder(5);
        setTopPriorityTasks(tasks);
        setIsLoading(false);
      } catch (error) {}
    }

    fetchTopFivePrioritizedTasks();
  }, [tasks]);

  return isLoading ? (
    <Spinner />
  ) : (
    <VStack>
      {topPriorityTasks.map((t) => {
        return <TaskCard task={t} />;
      })}
    </VStack>
  );
};

export default PriorityTab;
