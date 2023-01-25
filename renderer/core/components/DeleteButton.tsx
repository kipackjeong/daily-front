import { DeleteIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
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
      _hover={{ color: "brand.red.600" }}
      onClick={onClick}
      size={rest.size ? rest.size : "md"}
      {...rest}
    >
      <DeleteIcon />
    </Button>
  );
};

export default DeleteButton;
