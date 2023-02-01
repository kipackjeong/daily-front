import { Flex, FlexProps, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import DurationDisplay from "../../../../../core/components/ui/DurationDisplay";
import { useAppStatus } from "../../../../hooks/useAppStatus";
import categoryLocalService from "../../../../models/category/category.local-service";
import categoryService from "../../../../models/category/category.service";
import { ITask } from "../../../../models/task";
import Category from "../../../category/Category";

type TaskBlockLabelProps = {
  task: ITask;
  height;
} & FlexProps;
const TaskBlockLabel = ({ task, height, color }: TaskBlockLabelProps) => {
  const heightInNumber = height;
  const shouldLabelBeSmall = heightInNumber < 75;

  const [category, setCategory] = useState(null);

  const { isOnline } = useAppStatus();

  useEffect(() => {
    async function fetchCategory() {
      if (task.category) {
        const cat = isOnline
          ? await categoryService.findById(task.category)
          : await categoryLocalService.findById(task.category);
        setCategory(cat);
      }
    }

    fetchCategory();
  }, [task.category]);

  return (
    <Stack
      w="100%"
      h="100%"
      alignItems="center"
      justifyContent="flex"
      flexDirection={"row"}
      columnGap={{ base: "11%", md: "15%", lg: "25%" }}
    >
      {shouldLabelBeSmall ? (
        // small text
        <>
          <DurationDisplay
            width={{ sm: "40%", md: "50%", lg: "40%" }}
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
        // large test
        <>
          <DurationDisplay
            style={{ paddingLeft: "4%" }}
            width={{ sm: "40%", md: "50%", lg: "40%" }}
            fontSize="md"
            startTime={task.timeInterval.startTime}
            endTime={task.timeInterval.endTime}
          />
          <Flex w="30%" alignItems="center">
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
            <Flex w={"60%"} margin="0" pb={2}>
              <Text fontWeight={"bold"}>{task.title}</Text>
            </Flex>
          </Flex>
        </>
      )}
    </Stack>
  );
};

export default TaskBlockLabel;
