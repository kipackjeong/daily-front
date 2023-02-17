import { chakra, Flex, FlexProps, IconProps, Tooltip } from "@chakra-ui/react";
import React, { PropsWithChildren, useState } from "react";
import IconWrapper from "../IconWrapper";

type IconColors = {
  color: string | any;
  hoverColor: string;
};

type IconButtonProps = {
  onClick?;
  icon;
  iconColors: IconColors;
  isOnHover?: boolean;
  size?;
  style?;
  isSelected?;
  hoverMessage?;
};
const IconButton = ({
  onClick,
  icon,
  iconColors = {
    color: "brand.heavy",
    hoverColor: "brand.regular",
  },
  isOnHover = null,
  isSelected,
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
          size={size}
          as={icon}
          color={
            isOnHover || onHover || isSelected
              ? iconColors.hoverColor
              : iconColors.color
          }
          _checked={{
            color: iconColors.hoverColor,
          }}
          {...rest}
        />
      </Tooltip>
    </Flex>
  );
};

export default IconButton;
