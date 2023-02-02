import {
  Flex,
  Divider,
  Text,
  useStyleConfig,
  useInterval,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import useMediaSize from "../../hooks/useMediaSize";
import { useUISetting } from "../../hooks/useUISettings";
import {
  getAbsolutePositionFromDate,
  toAppTimeString,
} from "../../utils/helper";

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
  const { isMD } = useMediaSize();
  //#endregion

  return (
    <Flex
      w={isMini && isMD ? "88%" : "99%"}
      position="absolute"
      left={8}
      zIndex={10}
      className="curtime-markline-cont"
      pointerEvents={"none"}
      top={`${position}px`}
    >
      <Flex __css={textBoxStyle} bottom={timeStrPosition}>
        {currentTimeString}
      </Flex>
      <Divider __css={dividerStyle} />
    </Flex>
  );
};

export default CurrentTimeLine;
