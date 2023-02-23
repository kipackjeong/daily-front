import { Flex, FlexProps, Text } from "@chakra-ui/react";
import React, { MouseEventHandler } from "react";
import { toAppTimeString } from "../utils/helper";

type DurationDisplayProps = {
  startTime: Date;
  endTime: Date;
  width?;
  bold?: boolean;
  onClick?: MouseEventHandler<HTMLParagraphElement>;
} & FlexProps;
const DurationDisplay = ({
  startTime,
  endTime,
  fontSize,
  width,
  bold = false,
  onClick,
  ...rest
}: DurationDisplayProps) => {
  return (
    <Flex
      width={width}
      cursor="pointer"
      onClick={onClick}
      justifyContent="center"
      {...rest}
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
