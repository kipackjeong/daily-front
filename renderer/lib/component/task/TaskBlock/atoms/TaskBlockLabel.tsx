import { Flex, FlexProps, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import DurationDisplay from "../../../../../core/components/ui/DurationDisplay";
import categoryService from "../../../../models/category/category.service";
import { ITask } from "../../../../models/task";
import Category from "../../../category/Category";

type TaskBlockLabelProps = {
  task: ITask;
  height;
} & FlexProps;
const TaskBlockLabel = ({ task, height, color }: TaskBlockLabelProps) => {
  const heightInNumber = Number(height.substring(0, height.length));
  const shouldLabelBeSmall = heightInNumber < 75;

  const [category, setCategory] = useState(null);

  useEffect(() => {
    async function fetchCategory() {
      if (task.category) {
        const cat = await categoryService.findById(task.category);
        setCategory(cat);
      }
    }

    fetchCategory();
  }, [task.category]);

  return (
    <Stack
      w="100%"
      alignItems="center"
      justifyContent="flex-start"
      flexDirection={"row"}
      columnGap={2}
    >
      {shouldLabelBeSmall ? (
        <>
          <DurationDisplay
            style={{ marginLeft: "35px", width: "20em" }}
            startTime={task.timeInterval.startTime}
            endTime={task.timeInterval.endTime}
          />
          {category && (
            <Flex w="2em">
              <Category
                color={color}
                category={category}
                size={3}
                showTitle={false}
                isHoverable={false}
              />
            </Flex>
          )}
          <Flex w="7em" margin="0" pb={2}>
            <Text
              display="flex"
              alignItems={"center"}
              fontWeight={"bold"}
              textAlign={"center"}
              fontSize="sm"
            >
              {task.title}
            </Text>
          </Flex>
        </>
      ) : (
        <>
          <DurationDisplay
            style={{ marginLeft: "35px", width: "20em" }}
            fontSize="md"
            startTime={task.timeInterval.startTime}
            endTime={task.timeInterval.endTime}
          />
          {category && (
            <Flex w="2em" display="flex" justifyContent={"flex-end"}>
              <Category
                color={color}
                size={4}
                category={category}
                showTitle={false}
                isHoverable={false}
              />
            </Flex>
          )}
          <Flex w="7em" margin="0" pb={2}>
            <Text fontWeight={"bold"}>{task.title}</Text>
          </Flex>
        </>
      )}
    </Stack>
  );
};

export default TaskBlockLabel;
