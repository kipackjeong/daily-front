import { Flex } from "@chakra-ui/react";
import React from "react";

type BlockDecorationLineProps = {
  taskType: "To Do" | "Did" | string;
};
const BlockDecorationLine = ({ taskType }: BlockDecorationLineProps) => {
  const blockDecorationLineColor =
    taskType == "To Do" ? "brand.green.600" : "brand.xRegular";

  return (
    <Flex
      className="task-block_left-deco-line"
      height="100%"
      width="0.2%"
      bg={blockDecorationLineColor}
      position="absolute"
      left={0}
      borderRadius={2}
    />
  );
};

export default BlockDecorationLine;
