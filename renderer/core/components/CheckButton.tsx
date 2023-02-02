import { Button, ButtonProps, Tooltip } from "@chakra-ui/react";
import React, { PropsWithoutRef, ReactPropTypes } from "react";
import { FaCheck } from "react-icons/fa";

const CheckButton = ({
  style,
  color = "white",
  onClick,
  ...rest
}: ButtonProps) => {
  return (
    <Button
      color={color}
      backgroundColor="none"
      border="none"
      onClick={onClick}
      size={rest.size ? rest.size : "md"}
      {...rest}
    >
      <Tooltip label="Mark done" shouldWrapChildren={true}>
        <FaCheck />
      </Tooltip>
    </Button>
  );
};

export default CheckButton;
