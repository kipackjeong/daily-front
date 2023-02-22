import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ExpandableTab from "@core/components/ExpandableTab";
import { useAppStatus } from "../../hooks/useAppStatus";
import taskLocalService from "../../services/task/task.local-service";
import taskService from "@lib/services/task/task.service";
import TaskCard from "../task/TaskCard/TaskCard";
import { tabStyle } from "./styles";
import { selectTasks } from "@lib/redux/slices/task.slice";

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
      className="NextTab"
      title="Next"
      isLoading={isLoading}
      defaultIsOpen={true}
      {...tabStyle}
    >
      {nextTodos.map((t) => {
        return <TaskCard key={t._id} task={t} width="100%" />;
      })}
    </ExpandableTab>
  );
};

export default NextTab;
