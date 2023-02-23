import { Button, ButtonProps, Tooltip } from "@chakra-ui/react";
import React from "react";
import { FaUndoAlt } from "react-icons/fa";

const UndoButton = ({ style, onClick, ...rest }: ButtonProps) => {
  return (
    <Button
      width="fit-content"
      style={style}
      color={rest.color ? rest.color : "white"}
      backgroundColor="none"
      border="none"
      onClick={onClick}
      {...rest}
    >
      <Tooltip label="Undo" shouldWrapChildren={true}>
        <FaUndoAlt />
      </Tooltip>
    </Button>
  );
};

export default UndoButton;
