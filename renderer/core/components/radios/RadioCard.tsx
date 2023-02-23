import { Box, BoxProps, useRadio, UseRadioProps } from "@chakra-ui/react";
import { ReactJSXIntrinsicElements } from "@emotion/react/types/jsx-namespace";
import { useMemo } from "react";

// 1. Create a component that consumes the `useRadio` hook

type RadioCardProps = {
  colorScheme: "green" | "blue" | "yellow" | "red";
  label: string;
} & UseRadioProps &
  BoxProps;
const RadioCard = ({
  colorScheme,
  label,
  isChecked,
  ...rest
}: RadioCardProps) => {
  const colorSet = useMemo(() => {
    switch (colorScheme) {
      case "green":
        return {
          bgColor: "brand.green.200",
          _hover: { bg: "brand.green.250" },
          _checked: { bg: "brand.blue.200" },
        };
      case "red":
        return {
          bgColor: "brand.red.200",
          _hover: { bg: "brand.red.250" },
          _checked: { bg: "brand.blue.200" },
        };
      case "yellow":
        return {
          bgColor: "brand.yellow.200",
          _hover: { bg: "brand.yellow.250" },
          _checked: { bg: "brand.blue.200" },
        };
      case "blue":
        return {
          // bgColor: isChecked ? "brand.blue.200" : "brand.blue.50",
          bgColor: "brand.blue.50",
          _hover: { bg: "brand.blue.200" },
          _checked: { bg: "brand.blue.200" },
        };
    }
  }, [colorScheme]);

  const { getInputProps, getCheckboxProps } = useRadio({
    ...rest,
  });

  const input = getInputProps();
  const checkbox = getCheckboxProps(colorSet);

  console.log(checkbox);
  return (
    <Box as="label">
      <input {...input} />
      <Box
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        px={5}
        {...rest}
        {...checkbox}
      >
        {label}
      </Box>
    </Box>
  );
};

export default RadioCard;
