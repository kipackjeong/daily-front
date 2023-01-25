import { Flex } from "@chakra-ui/react";
import React, { PropsWithChildren, useState } from "react";
import { FaPlus } from "react-icons/fa";
import IconWrapper from "./IconWrapper";

interface IconButtonProps extends PropsWithChildren {
  onClick?;
  icon;
  color?;
  hoverColor?;
  isOnHover?: boolean;
  size?;
  style?;
  isSelected?;
}
const IconButton = ({
  onClick,
  icon,
  isOnHover = null,
  isSelected,
  color = "brand.heavy",
  hoverColor = "brand.regular",
  size,
  style,
}: IconButtonProps) => {
  const [onHover, setOnHover] = useState(isOnHover);

  function onMouseEnterHandler() {
    if (!onHover && isOnHover === null) setOnHover(true);
  }

  function onMouseOutHandler() {
    if (onHover && isOnHover === null) setOnHover(false);
  }

  return (
    <Flex
      style={style}
      flexDir="column"
      justifyContent="center"
      cursor="pointer"
      onClick={onClick}
      opacity={1}
      pointerEvents={isOnHover == null ? "auto" : "none"}
      onMouseEnter={onMouseEnterHandler}
      onMouseOut={onMouseOutHandler}
    >
      <IconWrapper
        size={size ? size : 3.5}
        as={icon}
        color={isOnHover || onHover || isSelected ? hoverColor : color}
      />
    </Flex>
  );
};

export default IconButton;
