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
} from "@chakra-ui/react";
import React, { MutableRefObject, useMemo } from "react";
import { FocusLevelRef } from "../TaskForm";

type FocusLevelSliderProps = {
  focusLevelRef?: MutableRefObject<FocusLevelRef>;
  defaultValue: number;
  disabled?: boolean;
};
// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
function FocusLevelSlider({
  focusLevelRef,
  defaultValue = 50,
  disabled = false,
  ...rest
}: FocusLevelSliderProps) {
  const [sliderValue, setSliderValue] = React.useState(defaultValue);
  const [showTooltip, setShowTooltip] = React.useState(false);

  let color = useMemo(() => {
    if (sliderValue < 35) {
      return "brand.light";
    } else if (35 < sliderValue && sliderValue < 65) {
      return "brand.regular";
    } else {
      return "brand.heavy";
    }
  }, [sliderValue]);

  return (
    <Flex flexDir="column" w="100%">
      <FormLabel>Focus Level </FormLabel>
      <Text fontSize="md" fontWeight="bold" textAlign="center">
        {sliderValue}
      </Text>

      <Slider
        id="slider"
        defaultValue={sliderValue}
        ref={focusLevelRef}
        min={0}
        max={100}
        width="100%"
        isDisabled={disabled}
        onChange={(v) => {
          setSliderValue(v);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SliderMark value={0} mt="1" ml="-2.5" fontSize="sm">
          Low
        </SliderMark>
        <SliderMark value={50} mt="1" ml="-2.5" fontSize="sm">
          Medium
        </SliderMark>
        <SliderMark value={100} mt="1" ml="-2.5" fontSize="sm">
          High
        </SliderMark>

        <SliderTrack>
          <SliderFilledTrack backgroundColor={color} />
        </SliderTrack>
        <Tooltip
          hasArrow
          bg="teal.500"
          color="white"
          placement="top"
          isOpen={showTooltip}
        >
          <SliderThumb />
        </Tooltip>
      </Slider>
    </Flex>
  );
}

export default FocusLevelSlider;
