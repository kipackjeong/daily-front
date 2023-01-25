import { Stack, Text } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import React, { ComponentProps } from "react";
import DurationDisplay from "../../../../../core/components/ui/DurationDisplay";

type TaskBlockLabelProps = {
  task;
  height;
};
const TaskBlockLabel = ({ task, height }: TaskBlockLabelProps) => {
  const heightInNumber = Number(height.substring(0, height.length));
  const shouldLabelBeSmall = heightInNumber < 75;
  const labelDynamicStyle = {
    w: "100%",
    fontSize: shouldLabelBeSmall ? "15px" : "25px",
    spacing: shouldLabelBeSmall ? 15 : 0,
  };

  return (
    <Stack
      {...labelDynamicStyle}
      direction={shouldLabelBeSmall ? "row" : "column"}
      justifyContent="center"
      alignItems="center"
    >
      {shouldLabelBeSmall ? (
        <>
          <DurationDisplay
            startTime={task.timeInterval.startTime}
            endTime={task.timeInterval.endTime}
          />
          <Text>{task.title}</Text>
        </>
      ) : (
        <>
          <Text>{task.title}</Text>
          <DurationDisplay
            startTime={task.timeInterval.startTime}
            endTime={task.timeInterval.endTime}
          />
        </>
      )}
    </Stack>
  );
};

export default TaskBlockLabel;
