import {
  Box,
  Flex,
  SystemStyleObject,
  Text,
  useStyleConfig,
} from "@chakra-ui/react";
import React, { MouseEventHandler } from "react";
import { getDayInStr } from "@core/utils/helper";
import useMediaSize from "@lib/hooks/useMediaSize";

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
  let containerStyle: SystemStyleObject = {
    margin: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    flexDir: "column",
    borderRadius: "10%",
    p: { base: 0, md: 1, lg: 3 },
    w: { base: "3em", lg: "4em" },
    bg: isHighlight
      ? "blackAlpha.800"
      : { base: "transparent", md: "transparent", lg: "transparent" },

    color: isHighlight ? "white" : { base: "black", md: "black", lg: "black" },

    transition: "color 0.4s ease, background-color 0.4s ease",

    _hover: {
      bg: isHighlight ? "blackAlpha.600" : { base: "gray.100", md: "gray.200" },
    },
  };

  let dateFontStyle: SystemStyleObject = {
    fontSize: { base: "s", md: "md", lg: "lg" },
  };
  let dayFontStyle: SystemStyleObject = {
    fontSize: { base: "xs", md: "s", lg: "md" },
  };

  return (
    <Flex
      className="date-selection__date-box"
      sx={containerStyle}
      opacity={isShallow ? 0.5 : 1}
      cursor={isShallow ? "default" : "pointer"}
      onClick={() => onClick(date)}
    >
      <Text fontWeight="bold" sx={dateFontStyle}>
        {date.getDate()}
      </Text>

      <Text sx={dayFontStyle} noOfLines={1}>
        {getDayInStr(date).substring(0, 3)}
      </Text>
    </Flex>
  );
};

export default DateBox;
