import { Icon } from "@chakra-ui/react";

type IconWrapperProps = {
  as;
  hoverColor?;
  color?;
  size?;
};
const IconWrapper = ({ as, color, size }: IconWrapperProps) => (
  <Icon
    as={as}
    mb={2}
    boxSize={size ? size : 6}
    pointerEvents="none"
    color={color}
  ></Icon>
);

export default IconWrapper;
