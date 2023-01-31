import { Button, ButtonProps, Tooltip } from "@chakra-ui/react";
import React, { PropsWithoutRef, ReactPropTypes } from "react";
import { FaCheck } from "react-icons/fa";

const CheckButton = ({ style, onClick, ...rest }: ButtonProps) => {
  return (
    <Button
      style={style}
      color={rest.color ? rest.color : "white"}
      backgroundColor="none"
      border="none"
      _hover={{ color: "brand.heavy" }}
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
