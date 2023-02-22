import { Flex, FlexProps, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import DurationDisplay from "@core/components/DurationDisplay";
import { useAppStatus } from "@lib/hooks//useAppStatus";
import categoryLocalService from "@lib/services/category/category.local-service";
import categoryService from "@lib/services/category/category.service";
import { ITask } from "@lib/models/task";
import Category from "@lib/components/category/Category";
import FocusLevelSlider from "../../TaskForm/atoms/FocusLevelSlider";

type TaskBlockLabelProps = {
  task: ITask;
  height;
} & FlexProps;
const TaskBlockLabel = ({
  task,
  height,
  color,
  columnGap,
  fontSize,
}: TaskBlockLabelProps) => {
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
    <Flex
      w="100%"
      h={height}
      alignItems="center"
      justifyContent="flex"
      flexDirection={"row"}
      columnGap={columnGap}
    >
      {shouldLabelBeSmall ? (
        // small text
        <>
          <DurationDisplay
            width={{ sm: "40%", md: "50%", lg: "40%" }}
            startTime={task.timeInterval.startTime}
            endTime={task.timeInterval.endTime}
            fontSize={fontSize}
          />
          <Flex m={0} p={0} w="30%" justifyContent={"center"}>
            <Flex w="15%">
              <Category
                color={color}
                category={category}
                size={3}
                showTitle={false}
                isHoverable={false}
              />
            </Flex>
            <Flex w="85%">
              <Text
                display="flex"
                alignItems={"center"}
                fontWeight={"bold"}
                textAlign={"center"}
                fontSize="sm"
              >
                {task.detail}
              </Text>
            </Flex>
            {task.taskType === "Did" && (
              <FocusLevelSlider
                flexDirection="row"
                gap={3}
                showMarks={false}
                showLabel={false}
                defaultValue={task.focusLevel}
                levelLabelSize={"xs"}
                width={"150px"}
                isReadOnly={true}
              />
            )}
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
          <Flex m={0} p={0} w="fit-content" alignItems="center">
            <Flex w="2em" display="flex" justifyContent={"flex-end"}>
              <Category
                color={color}
                size={4}
                category={category}
                showTitle={false}
                isHoverable={false}
              />
            </Flex>

            <Flex w={"60%"} margin="0">
              <Text display="flex" alignItems="center" fontWeight={"bold"}>
                {task.detail}
              </Text>
            </Flex>
            {task.taskType === "Did" && (
              <FocusLevelSlider
                flexDirection="row"
                gap={3}
                showMarks={false}
                showLabel={false}
                defaultValue={task.focusLevel}
                levelLabelSize={"xs"}
                width={"150px"}
                isReadOnly={true}
              />
            )}
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default TaskBlockLabel;
