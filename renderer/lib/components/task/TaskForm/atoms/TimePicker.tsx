import {
  NumberInput,
  NumberInputField,
  Flex,
  Text,
  FormControl,
  useStyleConfig,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { useSelector } from "react-redux";
import IconButton from "@core/components/IconButton";
import { selectTasks } from "@lib/redux/slices/task.slice";
import { ITask } from "@lib/models/task";

type TimeInputBlockType = {
  time: Date;
  onChange;
};
const TimeInputBlock = ({ time, onChange }: TimeInputBlockType) => {
  console.log("TimeInputBlock - render");

  const [hour, setHour] = useState(null);
  const [minute, setMinute] = useState(null);

  const [isAM, setIsAM] = useState(null);
  const [madeChange, setMadeChange] = useState(false);

  // this effect is needed for the prev/next task's time matching.
  useEffect(() => {
    setHour(
      time.getHours() > 12 && time.getHours() != 13
        ? time.getHours() - 12
        : time.getHours()
    );
    setMinute(time.getMinutes());
    setIsAM(time.getHours() < 12);
  }, [time]);

  function handleHourChange(str: string, num: number) {
    if (!str) {
      setHour(0);
    }
    if (str.length > 2) {
      str = str.substring(str.length - 2, str.length);
      num = Number(str);
    }

    if ((hour == 11 && num == 12) || (hour == 12 && num == 11)) {
      console.log(
        "  if ((hour == 11 && num == 12) || (hour == 12 && num == 11)) {"
      );

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
    setMadeChange(true);
  }

  function handleMinuteChange(str, num) {
    if (!str) {
      setHour(0);
    }
    if (str.length > 2) {
      str = str.substring(str.length - 2, str.length);
      num = Number(str);
    }

    if (num == 60) {
      setHour((prev) => prev + 1);
      num = 0;
    }
    if (num == -1) {
      setHour((prev) => prev - 1);
      num = 59;
    }
    setMinute(num);
    setMadeChange(true);
  }

  const widthPerBlock = "60px";

  const heightPerBlock = 50;

  const fontSize = "4xl";

  const hrFormat = (val) => {
    let newVal;

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
        inputMode="numeric"
        defaultValue={hour}
        max={24}
        min={0}
        w={widthPerBlock}
        h={heightPerBlock}
        border="none"
        clampValueOnBlur={true}
        value={hrFormat(hour)}
        onChange={handleHourChange}
        onBlur={(e) => {
          const newHour =
            hour != 13 && hour != 12 && hour >= 1 && !isAM ? hour + 12 : hour;
          onChange(newHour, minute);
          setMadeChange(false);
        }}
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
        onBlur={(e) => {
          const newHour =
            hour != 13 && hour != 12 && hour >= 1 && !isAM ? hour + 12 : hour;
          onChange(newHour, minute);
          setMadeChange(false);
        }}
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

  const tasks = useSelector(selectTasks);

  const containerStyle = useStyleConfig("Flex", {
    variant: "timePickerContainer",
  });

  const { prevTask, nextTask } = useMemo(() => {
    let i = -1;

    let prevTask: ITask = tasks.at(-1);
    let nextTask: ITask;

    while (prevTask && prevTask.timeInterval.endTime >= endTime) {
      prevTask = tasks.at(--i);
    }
    prevTask = tasks.filter((t) => t.timeInterval.endTime < startTime).at(-1);

    nextTask = tasks.find((t) => t.timeInterval.startTime > endTime);

    return { prevTask, nextTask };
  }, []);

  return (
    <Flex className="timepicker-cont" __css={containerStyle}>
      {prevTask && (
        <IconButton
          icon={FaRegClock}
          hoverMessage="previous tasks's end time."
          onClick={() => {
            onStartTimeChange(
              prevTask.timeInterval.endTime.getHours(),
              prevTask.timeInterval.endTime.getMinutes()
            );
          }}
        />
      )}

      <FormControl
        className="timepicker-cont__st-formctrl"
        display="flex"
        width="170px"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <TimeInputBlock time={startTime} onChange={onStartTimeChange} />
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
      </FormControl>
      {nextTask && (
        <IconButton
          icon={FaRegClock}
          hoverMessage="next task's start time"
          onClick={() => {
            onEndTimeChange(
              nextTask.timeInterval.startTime.getHours(),
              nextTask.timeInterval.startTime.getMinutes()
            );
          }}
        />
      )}
    </Flex>
  );
};

export default TimePicker;
