import { Box, useRadio, UseRadioProps } from "@chakra-ui/react";
import { ReactJSXIntrinsicElements } from "@emotion/react/types/jsx-namespace";

// 1. Create a component that consumes the `useRadio` hook

type RadioCardProps = { children: ReactJSXIntrinsicElements } & UseRadioProps;
const RadioCard = (props: RadioCardProps) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...props}
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        px={5}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export default RadioCard;
