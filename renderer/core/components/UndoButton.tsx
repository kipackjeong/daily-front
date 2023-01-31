import { Button, ButtonProps, Tooltip } from "@chakra-ui/react";
import React from "react";
import { FaUndoAlt } from "react-icons/fa";

const UndoButton = ({ style, onClick, ...rest }: ButtonProps) => {
  return (
    <Button
      style={style}
      color={rest.color ? rest.color : "white"}
      backgroundColor="none"
      border="none"
      _hover={{ color: "brand.green.300" }}
      onClick={onClick}
      size={rest.size ? rest.size : "md"}
      {...rest}
    >
      <Tooltip label="Undo" shouldWrapChildren={true}>
        <FaUndoAlt />
      </Tooltip>
    </Button>
  );
};

export default UndoButton;
