import { DeleteIcon } from "@chakra-ui/icons";
import { Button, ButtonProps, Tooltip } from "@chakra-ui/react";
import React from "react";

type DeleteButtonProps = {
  style?;
  onClick;
} & ButtonProps;

const DeleteButton = ({
  style,
  color = "white",
  ...rest
}: DeleteButtonProps) => {
  return (
    <Button
      style={style}
      color={color}
      backgroundColor="none"
      border="none"
      {...rest}
    >
      <Tooltip label="Delete" shouldWrapChildren={true}>
        <DeleteIcon />
      </Tooltip>
    </Button>
  );
};

export default DeleteButton;
