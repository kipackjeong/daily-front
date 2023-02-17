import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ExpandableTab from "../../../core/components/ExpandableTab";
import { useAppStatus } from "../../hooks/useAppStatus";
import { selectTasks } from "../../models/task";
import taskLocalService from "../../services/task.local-service";
import taskService from "../../services/task.service";
import TaskCard from "../task/TaskCard/TaskCard";

const NextTab = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [nextTodos, setNextTodos] = useState([]);

  const tasks = useSelector(selectTasks);

  const { isOnline } = useAppStatus();

  useEffect(() => {
    setIsLoading(true);
    fetchNextTodos();

    // GET tasks/?after
    async function fetchNextTodos() {
      const newTasks = isOnline
        ? await taskService.findNextTodos()
        : await taskLocalService.findNextTodos();

      setNextTodos(newTasks);

      setIsLoading(false);
    }
  }, [tasks]);

  return (
    <ExpandableTab
      title="Next"
      isLoading={isLoading}
      defaultIsOpen={true}
      w={{ base: "15em", sm: "100%", md: "22em", lg: "30em" }}
    >
      {nextTodos.map((t) => {
        return <TaskCard key={t._id} task={t} width="100%" />;
      })}
    </ExpandableTab>
  );
};

export default NextTab;