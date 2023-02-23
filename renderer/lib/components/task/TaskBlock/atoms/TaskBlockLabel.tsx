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
  isMini: boolean;
} & FlexProps;
const TaskBlockLabel = ({
  isMini,
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
      className="TaskBlockLabel"
      w="100%"
      h={height}
      alignItems="center"
      flexDirection={"row"}
      gap={{
        base: "11%",
        md: isMini ? "0%" : "15%",
        lg: "0%",
      }}
    >
      <DurationDisplay
        pl={"1em"}
        startTime={task.timeInterval.startTime}
        endTime={task.timeInterval.endTime}
        fontSize={{
          base: "4xs",
          sm: "3xs",
          md: "xs",
          lg: "sm",
        }}
      />

      <Flex flex={1} m={0} pl={2} pr={2} w="30%" gap={{ base: 0, md: "1em" }}>
        <Flex w="15%" alignItems="center" justifyContent="center">
          <Category
            color={color}
            category={category}
            size={3}
            showTitle={false}
            isHoverable={false}
          />
        </Flex>

        <Flex w="50%" justifyContent="center">
          <Text
            display="flex"
            alignItems={"center"}
            fontWeight={"bold"}
            textAlign={"center"}
            justifyContent="center"
            fontSize={{
              base: "4xs",
              sm: "3xs",
              md: "xs",
              lg: "sm",
            }}
          >
            {task.detail}
          </Text>
        </Flex>
        {task.taskType === "Did" && (
          <FocusLevelSlider
            flexDirection="row"
            gap={2}
            fontSize={{
              base: "4xs",
              sm: "3xs",
              md: "2xs",
              lg: "sm",
            }}
            showMarks={false}
            showLabel={false}
            defaultValue={task.focusLevel}
            flex={0.8}
            width={{ base: "40px", lg: "150px" }}
            isReadOnly={true}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default TaskBlockLabel;
