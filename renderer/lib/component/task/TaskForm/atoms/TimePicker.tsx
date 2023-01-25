import {
  NumberInput,
  NumberInputField,
  Flex,
  Text,
  FormControl,
  FormErrorMessage,
  useStyleConfig,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import logger from "../../../../../utils/logger";

type TimeInputBlockType = {
  time: Date;
  onChange;
};
const TimeInputBlock = ({ time, onChange }: TimeInputBlockType) => {
  console.log("TimeInputBlock - render");

  const [hour, setHour] = useState(Number(time.getHours()));

  const [minute, setMinute] = useState(Number(time.getMinutes()));

  function handleHourChange(e) {
    setHour(e);
    onChange(e, minute);
  }
  function handleMinuteChange(e) {
    setMinute(e);
    onChange(hour, e);
  }

  const widthPerBlock = "60px";

  const heightPerBlock = 50;

  const fontSize = "4xl";

  const format = (val) => {
    if (val < 10) {
      val = "0" + val;
    }

    return val;
  };

  const numberInputFieldStyle = {
    height: "100%",
    padding: 0,
    border: "none",
    fontSize: fontSize,
    fontWeight: "bold",
    textAlign: "center",
  };
  return (
    <>
      <NumberInput
        allowMouseWheel
        defaultValue={Number(time.getHours())}
        max={24}
        min={1}
        w={widthPerBlock}
        h={heightPerBlock}
        border="none"
        clampValueOnBlur={false}
        value={format(time.getHours())}
        onChange={handleHourChange}
      >
        <NumberInputField sx={numberInputFieldStyle} />
      </NumberInput>
      <Text>:</Text>
      <NumberInput
        allowMouseWheel
        defaultValue={Number(time.getMinutes())}
        max={59}
        min={0}
        value={format(minute)}
        w={widthPerBlock}
        h={heightPerBlock}
        clampValueOnBlur={false}
        onChange={handleMinuteChange}
      >
        <NumberInputField sx={numberInputFieldStyle} />
      </NumberInput>
      <Text fontSize={fontSize} fontWeight="bold">
        {hour < 12 ? "am" : "pm"}
      </Text>
    </>
  );
};

type TimePickerProps = {
  startTime: Date;
  endTime: Date;
  setTime: Function;
  onStartTimeChange;
  onEndTimeChange;
};

const TimePicker = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
}: TimePickerProps) => {
  console.log("TimePicker - render");

  const startTimeError = useMemo(
    () => startTime.getTime() > endTime.getTime(),
    [startTime]
  );

  const endTimeError = endTime.getTime() < startTime.getTime();

  const containerStyle = useStyleConfig("Flex", {
    variant: "timePickerContainer",
  });

  return (
    <Flex className="timepicker-cont" __css={containerStyle}>
      <FormControl
        className="timepicker-cont__st-formctrl"
        display="flex"
        width="170px"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <TimeInputBlock time={startTime} onChange={onStartTimeChange} />
        {startTimeError && (
          <FormErrorMessage>
            The start time should be before the end time.
          </FormErrorMessage>
        )}
      </FormControl>
      <Text> - </Text>
      <FormControl
        className="timepicker__et-formctrl"
        display="flex"
        width="170px"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <TimeInputBlock time={endTime} onChange={onEndTimeChange} />
        {endTimeError && (
          <FormErrorMessage>
            The end time should be after the start time.
          </FormErrorMessage>
        )}
      </FormControl>
    </Flex>
  );
};

export default TimePicker;
