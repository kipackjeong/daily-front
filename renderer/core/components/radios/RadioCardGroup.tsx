import { FlexProps, Stack, StyleProps, useRadioGroup } from "@chakra-ui/react";
import React, { useState } from "react";
import RadioCard from "./RadioCard";

type RadioCardGroupProps = {
  defaultValue: string | number;
  options: {
    value?: string | number;
    label: string;
    colorScheme?: string;
    style?: StyleProps;
  }[];
  onChange: (v) => void;
} & Exclude<FlexProps, "defaultValue" | "onChange">;

const RadioCardGroup = ({
  defaultValue,
  options,
  onChange: onChangeFromParent,
  ...rest
}: RadioCardGroupProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "tasktype",
    defaultValue: defaultValue,
    onChange: (v) => {
      onChangeFromParent(v);
      setSelectedValue(v);
    },
    value: selectedValue,
  });

  const rootProps = getRootProps();

  return (
    <Stack spacing={5} direction="row" mt={3} {...rootProps} {...rest}>
      {options.map((option) => {
        const radioProps = getRadioProps(option);

        return (
          <RadioCard
            key={option.label}
            label={option.label}
            style={option.style}
            colorScheme={option.colorScheme}
            {...radioProps}
          />
        );
      })}
    </Stack>
  );
};

export default RadioCardGroup;
