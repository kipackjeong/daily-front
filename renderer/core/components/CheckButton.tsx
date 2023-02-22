import { Button, ButtonProps, Tooltip } from "@chakra-ui/react";
import React, { PropsWithoutRef, ReactPropTypes } from "react";
import { FaCheck } from "react-icons/fa";

const CheckButton = ({ style, color = "white", ...rest }: ButtonProps) => {
  return (
    <Button backgroundColor="none" border="none" {...rest}>
      <Tooltip label="Mark done" shouldWrapChildren={true}>
        <FaCheck />
      </Tooltip>
    </Button>
  );
};

export default CheckButton;
