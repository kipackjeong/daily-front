import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Tab } from "@chakra-ui/tabs";
import { useAppStatus } from "../../../hooks/useAppStatus";
import { selectTasks } from "../../../models/task";
import taskLocalService from "../../../services/task.local-service";
import taskService from "../../../services/task.service";
import TaskCard from "../../task/TaskCard/TaskCard";

const OverdueTab = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [overdueTodos, setOverdueTodos] = useState([]);

  const tasks = useSelector(selectTasks);

  const { isOnline } = useAppStatus();

  useEffect(() => {
    setIsLoading(true);
    fetchOverdueTodos();

    // GET tasks/?after
    async function fetchOverdueTodos() {
      const newTasks = isOnline
        ? await taskService.findOverdueTodos()
        : await taskLocalService.findOverdueTodos();

      setOverdueTodos(newTasks);

      setIsLoading(false);
    }
  }, [tasks]);

  return (
    <Tab
      w={{ base: "15em", sm: "100%", md: "22em", lg: "30em" }}
      title={"Overdue"}
    >
      {overdueTodos.map((t) => {
        return <TaskCard key={t._id} task={t} />;
      })}{" "}
    </Tab>
  );
};

export default OverdueTab;
