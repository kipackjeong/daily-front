import {
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  Tooltip,
  SliderThumb,
  Text,
  Flex,
  FormLabel,
  SliderProps,
  FlexProps,
  ResponsiveValue,
} from "@chakra-ui/react";
import { number } from "prop-types";
import React, { MutableRefObject, useMemo } from "react";
import { boolean } from "webidl-conversions";
import { ITask } from "@lib/models/task/task.interface";
import { FocusLevelRef } from "../TaskForm";

type FocusLevelSliderProps = {
  task?: ITask;
  showLabel?: boolean;
  showMarks?: boolean;
  levelLabelSize?;
  focusLevelRef?: MutableRefObject<FocusLevelRef>;
  defaultValue: number;
  disabled?: boolean;
  isReadOnly?: boolean;
  onChangeEnd?;
  fontSize?;
} & FlexProps;
// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
function FocusLevelSlider({
  task,
  showLabel = true,
  showMarks = true,
  focusLevelRef,
  defaultValue = 50,
  disabled = false,
  isReadOnly = false,
  onChangeEnd,
  fontSize,
  ...rest
}: FocusLevelSliderProps) {
  const [sliderValue, setSliderValue] = React.useState(defaultValue);
  const [showTooltip, setShowTooltip] = React.useState(false);

  let color = useMemo(() => {
    if (sliderValue < 35) {
      return "brand.red.250";
    } else if (35 < sliderValue && sliderValue < 65) {
      return "brand.yellow.250";
    } else {
      return "brand.green.250";
    }
  }, [sliderValue]);

  return (
    <Flex flexDirection="column" alignItems="center" {...rest}>
      {showLabel && <FormLabel>Focus Level </FormLabel>}
      <Text
        fontSize={fontSize}
        fontWeight="bold"
        textAlign="center"
        display="flex"
        alignItems={"center"}
      >
        {sliderValue}
      </Text>

      <Slider
        id="slider"
        width={"100%"}
        defaultValue={sliderValue}
        ref={focusLevelRef}
        min={0}
        max={100}
        isDisabled={disabled}
        isReadOnly={isReadOnly}
        onChange={(v) => {
          setSliderValue(v);
        }}
        onChangeEnd={(v) => {
          if (onChangeEnd) {
            onChangeEnd(v);
          }
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {showMarks && (
          <>
            <SliderMark value={0} mt="1" ml="-2.5" fontSize="sm">
              Low
            </SliderMark>
            <SliderMark value={50} mt="1" ml="-2.5" fontSize="sm">
              Medium
            </SliderMark>
            <SliderMark value={100} mt="1" ml="-2.5" fontSize="sm">
              High
            </SliderMark>
          </>
        )}

        <SliderTrack>
          <SliderFilledTrack backgroundColor={color} />
        </SliderTrack>
        {!isReadOnly && (
          <Tooltip
            hasArrow
            bg="teal.500"
            color="white"
            placement="top"
            isOpen={showTooltip}
          >
            <SliderThumb />
          </Tooltip>
        )}
      </Slider>
    </Flex>
  );
}

export default FocusLevelSlider;
