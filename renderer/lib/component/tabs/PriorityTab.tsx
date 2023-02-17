import { FlexProps, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ExpandableTab from "../../../core/components/ExpandableTab";
import { useAppStatus } from "../../hooks/useAppStatus";
import { selectTasks } from "../../models/task";
import taskLocalService from "../../services/task.local-service";
import taskService from "../../services/task.service";
import TaskCard from "../task/TaskCard/TaskCard";
type PriorityTabProps = {} & FlexProps;

const PriorityTab = (props: PriorityTabProps) => {
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
        console.log("tasks: ");
        console.log(tasks);
        setTopPriorityTasks(tasks);
        setIsLoading(false);
      } catch (error) {}
    }
  }, [tasks]);

  return (
    <ExpandableTab
      title="Priority"
      isLoading={isLoading}
      defaultIsOpen={true}
      w={{ base: "15em", sm: "100%", md: "22em", lg: "30em" }}
    >
      {topPriorityTasks.map((t) => {
        return <TaskCard task={t} width="100%" />;
      })}
    </ExpandableTab>
  );
};

export default PriorityTab;
