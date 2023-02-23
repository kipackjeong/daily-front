import { Flex, Divider, useStyleConfig, useInterval } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import useMediaSize from "../../hooks/useMediaSize";
import { useUISetting } from "../../hooks/useUISettings";
import {
  getAbsolutePositionFromDate,
  toAppTimeString,
} from "@core/utils/helper";

type CurrentTimeLineProps = { isMini: boolean };
const CurrentTimeLine = ({ isMini = false }: CurrentTimeLineProps) => {
  const { pixelPerHour } = useUISetting();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [position, setPosition] = useState(
    getAbsolutePositionFromDate(currentTime, pixelPerHour)
  );
  const [currentTimeString, setCurrentTimeString] = useState("");

  // this effect is needed to avoid the hydration error.
  useEffect(() => {
    const currentTimeLocaleString = toAppTimeString(currentTime);

    setCurrentTimeString(currentTimeLocaleString);
  }, [currentTime]);

  // Clock ticking implementation.
  useInterval(() => {
    const newDate = new Date();
    setCurrentTime(newDate);
    setPosition(getAbsolutePositionFromDate(newDate, pixelPerHour));
  }, 1000);

  //#region Styles

  const dividerStyle = useStyleConfig("Divider", {
    variant: "currentTimeLine",
  });

  const textBoxStyle = useStyleConfig("Flex", {
    variant: "curTimeMarkLineTextBox",
  });
  const timeStrPosition = useMemo(() => {
    return currentTime.getHours() == 0 && currentTime.getMinutes() < 30
      ? "-25px"
      : "5px";
  }, [currentTime]);
  const { isBase, isSM, isMD, isLG, isXL } = useMediaSize();
  //#endregion
  let width = useMemo(() => {
    if (isXL) {
      return isMini ? "95%" : "94.7%";
    }
    if (isLG) {
      return isMini ? "91.5%" : "93.5%";
    }
    if (isMD) {
      return isMini ? "91%" : "90.7%";
    }
    if (isSM) {
      return isMini ? "86%" : "88%";
    }
    if (isBase) {
      return "88%";
    }
    return "95%";
  }, [isBase, isSM, isMD, isLG, isXL]);

  return (
    <Flex
      w={width}
      position="absolute"
      left={9}
      zIndex={10}
      className="curtime-markline-cont"
      pointerEvents={"none"}
      top={`${position}px`}
    >
      <Flex position="relative">
        <Flex
          color="brand.blue.200"
          w="100px"
          textAlign="center"
          position="absolute"
          left={isMD ? "-15%" : "-5%"}
          bottom={timeStrPosition}
          fontSize={isMini ? "xs" : "sm"}
          textOverflow="ellipsis"
        >
          {currentTimeString}
        </Flex>
      </Flex>

      <Divider __css={dividerStyle} />
    </Flex>
  );
};

export default CurrentTimeLine;
