import {
  FlexProps,
  Stack,
  StyleProps,
  Tooltip,
  useRadioGroup,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { Fa500Px } from "react-icons/fa";
import RadioCard from "./RadioCard";
import RadioIcon from "./RadioIcon";

type RadioIconGroupProps = {
  defaultValue: string | number;
  options: {
    icon: IconType;
    value?: string | number;
    label: string;
    colorScheme?: string;
    style?: StyleProps;
  }[];
  onChange: (v) => void;
} & Exclude<FlexProps, "defaultValue" | "onChange">;

const RadioIconGroup = ({
  defaultValue,
  options,
  onChange: onChangeFromParent,
  ...rest
}: RadioIconGroupProps) => {
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
    <Stack spacing={1} direction="row" mt={3} {...rootProps} {...rest}>
      {options.map((option) => {
        const radioProps = getRadioProps({ value: option.label });

        return (
          <Tooltip
            fontSize="xs"
            bottom={70}
            label={option.label}
            shouldWrapChildren={true}
          >
            <RadioIcon
              key={option.label}
              label={option.label}
              style={option.style}
              colorScheme={option.colorScheme}
              icon={option.icon}
              {...radioProps}
            />
          </Tooltip>
        );
      })}
    </Stack>
  );
};

export default RadioIconGroup;
