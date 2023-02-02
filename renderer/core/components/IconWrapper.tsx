import { Icon, IconProps } from "@chakra-ui/react";

type IconWrapperProps = {
  as;
  hoverColor?;
  color?;
  size?;
} & IconProps;
const IconWrapper = ({ as, color, size, ...rest }: IconWrapperProps) => (
  <Icon
    as={as}
    mb={2}
    boxSize={size ? size : 6}
    pointerEvents="none"
    color={color}
    {...rest}
  ></Icon>
);

export default IconWrapper;
