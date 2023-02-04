import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Tab from "../../../core/components/Tab";
import { selectTasks, taskService } from "../../models/task";
import TaskCard from "../task/TaskCard/TaskCard";

const NextTab = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [nextTodos, setNextTodos] = useState([]);

  const tasks = useSelector(selectTasks);

  useEffect(() => {
    setIsLoading(true);
    fetchNextTodos();

    // GET tasks/?after
    async function fetchNextTodos() {
      const newTasks = await taskService.findNextTodos();
      setNextTodos(newTasks);

      setIsLoading(false);
    }
  }, [tasks]);

  return (
    <Tab title={"Next"} isLoading={isLoading} defaultIsOpen={true}>
      {nextTodos.map((t) => {
        return <TaskCard task={t} />;
      })}{" "}
    </Tab>
  );
};

export default NextTab;
