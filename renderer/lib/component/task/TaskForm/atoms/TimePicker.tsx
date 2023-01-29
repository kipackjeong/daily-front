import {
  NumberInput,
  NumberInputField,
  Flex,
  Text,
  FormControl,
  FormErrorMessage,
  useStyleConfig,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";

type TimeInputBlockType = {
  time: Date;
  onChange;
};
const TimeInputBlock = ({ time, onChange }: TimeInputBlockType) => {
  console.log("TimeInputBlock - render");

  const [hour, setHour] = useState(
    time.getHours() > 12 ? time.getHours() - 12 : time.getHours()
  );

  const [minute, setMinute] = useState(time.getMinutes());

  const [isAM, setIsAM] = useState(time.getHours() < 12 ? true : false);

  useEffect(() => {
    console.log("hour: " + hour);
    console.log("minute: " + minute);
    console.log("isAM: " + isAM);
    onChange(
      hour != 13 && hour != 12 && hour >= 2 && !isAM ? hour + 12 : hour,
      minute
    );
  }, [hour, minute, isAM]);

  function handleHourChange(str, num) {
    if ((hour == 11 && num == 12) || (hour == 12 && num == 11)) {
      setIsAM((prev) => !prev);

      if (!isAM) {
        num = hour == 12 && num == 11 ? 11 : 0;
      }
    }

    if (((hour == 1 && num == 0) || (hour == 13 && num == 0)) && !isAM) {
      num = 12;
    }

    //local state
    setHour(num);

    // if (hour == 13 && num == 12) {
    //   setIsAM(true);
    // }
  }

  function handleMinuteChange(str, num) {
    if (minute == 59 && num == 60) {
      setHour((prev) => prev + 1);
      num = 0;
    }
    if (minute == 0 && num == -1) {
      setHour((prev) => prev - 1);
      num = 59;
    }
    setMinute(num);
  }

  const widthPerBlock = "60px";

  const heightPerBlock = 50;

  const fontSize = "4xl";

  const hrFormat = (val) => {
    let newVal;
    console.log("hrFormat");
    // console("hour: " + hour);
    // console.log("val: " + val);

    newVal = val > 12 ? val - 12 : val;

    return format(newVal);
  };

  const format = (val) => {
    if (val < 10) {
      val = "0" + val;
    }
    if (val == -1) {
      return val;
    }

    if (val.length > 2) {
      return val.substring(val.length - 2, val.length);
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
        defaultValue={hour}
        max={24}
        min={0}
        w={widthPerBlock}
        h={heightPerBlock}
        border="none"
        clampValueOnBlur={true}
        value={hrFormat(hour)}
        onChange={handleHourChange}
      >
        <NumberInputField sx={numberInputFieldStyle} />
      </NumberInput>
      <Text>:</Text>
      <NumberInput
        allowMouseWheel
        defaultValue={minute}
        max={60}
        min={-1}
        value={format(minute)}
        w={widthPerBlock}
        h={heightPerBlock}
        clampValueOnBlur={true}
        onChange={handleMinuteChange}
      >
        <NumberInputField sx={numberInputFieldStyle} />
      </NumberInput>
      <Text fontSize={fontSize} fontWeight="bold">
        {isAM ? "am" : "pm"}
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
