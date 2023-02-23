import { Box, BoxProps, useRadio, UseRadioProps } from "@chakra-ui/react";
import { useMemo } from "react";
import IconButton from "../buttons/IconButton";

// 1. Create a component that consumes the `useRadio` hook

type RadioIconProps = {
  colorScheme?: "green" | "blue" | "yellow" | "red";
  icon;
} & UseRadioProps &
  BoxProps;
const RadioIcon = ({ colorScheme, icon, ...rest }: RadioIconProps) => {
  const iconColors = useMemo(() => {
    switch (colorScheme) {
      case "green":
        return {
          color: "brand.green.250",
          hoverColor: "brand.green.300",
        };
      case "red":
        return {
          color: "brand.red.250",
          hoverColor: "brand.red.300",
        };
      case "yellow":
        return {
          color: "brand.yellow.250",
          hoverColor: "brand.yellow.300",
        };
      case "blue":
        return {
          color: "brand.blue.200",
          hoverColor: "brand.xRegular",
        };
      default:
        return {};
    }
  }, [colorScheme]);

  const { getInputProps, getCheckboxProps } = useRadio({
    ...rest,
  });

  const input = getInputProps();
  const checkbox = getCheckboxProps();
  console.log(checkbox);

  return (
    <Box as="label">
      <input {...input} />
      <IconButton
        size={6}
        icon={icon}
        isSelected={checkbox["data-hover"] === ""}
        {...checkbox}
        color={iconColors.color}
        hoverColor={iconColors.hoverColor}
      />
    </Box>
  );
};

export default RadioIcon;
