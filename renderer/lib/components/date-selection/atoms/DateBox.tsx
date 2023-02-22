import { Box, Flex, Text, useStyleConfig } from "@chakra-ui/react";
import React, { MouseEventHandler } from "react";
import { getDayInStr } from "@core/utils/helper";

type DateProp = {
  date: Date;
  fontSizes?: string[];
  isShallow?: boolean;
  isHighlight?: boolean;
  onClick?: Function;
};
const DateBox = ({
  date,
  fontSizes,
  isShallow = false,
  isHighlight = false,
  onClick,
}: DateProp) => {
  const containerStyle = useStyleConfig("Flex", {
    variant: isHighlight ? "dateBox-highlight" : "dateBox",
  });

  const dateSize = fontSizes ? fontSizes[0] : "1.5rem";
  const daySize = fontSizes ? fontSizes[1] : "1rem";

  return (
    <Flex
      className="date-selection__date-box"
      sx={containerStyle}
      opacity={isShallow ? 0.5 : 1}
      cursor={isShallow ? "default" : "pointer"}
      onClick={() => onClick(date)}
    >
      <Text fontWeight="bold" fontSize={{ base: "s ", md: dateSize }}>
        {date.getDate()}
      </Text>

      <Text
        fontSize={{ base: "xs ", md: daySize }}
        w={{ base: "50px", md: "100%" }}
        noOfLines={1}
      >
        {getDayInStr(date)}
      </Text>
    </Flex>
  );
};

export default DateBox;
