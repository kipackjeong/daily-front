import { Flex, Text } from "@chakra-ui/react";
import React, { MouseEventHandler } from "react";
import { toAppTimeString } from "../../../lib/utils/helper";

type DurationDisplayProps = {
  startTime: Date;
  endTime: Date;
  fontSize?: string;
  bold?: boolean;
  onClick?: MouseEventHandler<HTMLParagraphElement>;
};
const DurationDisplay = ({
  startTime,
  endTime,
  fontSize,
  bold = false,
  onClick,
}: DurationDisplayProps) => {
  return (
    <Flex cursor="pointer" onClick={onClick}>
      <Text
        pointerEvents="none"
        fontWeight={bold && "bold"}
        fontSize={fontSize}
      >{`${toAppTimeString(startTime)} - ${toAppTimeString(endTime)}`}</Text>
    </Flex>
  );
};

export default DurationDisplay;
