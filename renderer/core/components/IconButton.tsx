import { chakra, Flex, FlexProps, Tooltip } from "@chakra-ui/react";
import React, { PropsWithChildren, useState } from "react";
import IconWrapper from "./IconWrapper";

type IconButtonProps = {
  onClick?;
  icon;
  color?;
  hoverColor?;
  isOnHover?: boolean;
  size?;
  style?;
  isSelected?;
  hoverMessage?;
} & FlexProps;
const IconButton = ({
  onClick,
  icon,
  isOnHover = null,
  isSelected,
  color = "brand.heavy",
  hoverColor = "brand.regular",
  hoverMessage,
  size = 3.5,
  style,
  ...rest
}: IconButtonProps) => {
  const [onHover, setOnHover] = useState(isOnHover);

  function onMouseEnterHandler() {
    if (!onHover && isOnHover === null) setOnHover(true);
  }

  function onMouseOutHandler() {
    if (onHover && isOnHover === null) setOnHover(false);
  }

  const Icon = chakra(icon);

  return (
    <Flex
      style={style}
      position="relative"
      flexDir="column"
      justifyContent="center"
      cursor="pointer"
      onClick={onClick}
      opacity={1}
      pointerEvents={isOnHover == null ? "auto" : "none"}
      onMouseEnter={onMouseEnterHandler}
      onMouseOut={onMouseOutHandler}
      {...rest}
    >
      <Tooltip
        bottom="75px"
        fontSize="xs"
        label={hoverMessage}
        shouldWrapChildren={true}
      >
        <IconWrapper
          margin="auto"
          size={size}
          as={icon}
          color={isOnHover || onHover || isSelected ? hoverColor : color}
        />
      </Tooltip>
    </Flex>
  );
};

export default IconButton;
