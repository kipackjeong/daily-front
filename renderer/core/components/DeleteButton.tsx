import { DeleteIcon } from "@chakra-ui/icons";
import { Button, Tooltip } from "@chakra-ui/react";
import React from "react";

type DeleteButtonProps = {
  style?;
  onClick;
} & Record<string, any>;

const DeleteButton = ({ style, onClick, ...rest }: DeleteButtonProps) => {
  return (
    <Button
      style={style}
      color={rest.color ? rest.color : "white"}
      backgroundColor="none"
      border="none"
      _hover={{ color: "brand.red.600" }}
      onClick={onClick}
      size={rest.size ? rest.size : "md"}
      {...rest}
    >
      <Tooltip label="Delete" shouldWrapChildren={true}>
        <DeleteIcon />
      </Tooltip>
    </Button>
  );
};

export default DeleteButton;
