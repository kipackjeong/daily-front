import { Flex, FlexProps, Text } from "@chakra-ui/react";
import React, { MouseEventHandler } from "react";
import { toAppTimeString } from "../../../lib/utils/helper";

type DurationDisplayProps = {
  startTime: Date;
  endTime: Date;
  bold?: boolean;
  onClick?: MouseEventHandler<HTMLParagraphElement>;
} & FlexProps;
const DurationDisplay = ({
  startTime,
  endTime,
  fontSize,
  bold = false,
  style,
  onClick,
}: DurationDisplayProps) => {
  return (
    <Flex
      style={style}
      cursor="pointer"
      onClick={onClick}
      justifyContent="center"
    >
      <Text
        pointerEvents="none"
        fontWeight={bold && "bold"}
        fontSize={fontSize}
      >{`${toAppTimeString(startTime)} - ${toAppTimeString(endTime)}`}</Text>
    </Flex>
  );
};

export default DurationDisplay;
