import {
  Box,
  Flex,
  FlexProps,
  Icon,
  Link,
  useStyleConfig,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { LinkItemProps } from "./SideBar";

interface NavItemProps extends FlexProps {
  link: LinkItemProps;
}

const NavItem = ({ link }: NavItemProps) => {
  const containerStyle = useStyleConfig("Flex", { variant: "navItem" });
  return (
    <Link
      href={link.link}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex __css={containerStyle}>
        {link.icon && (
          <Icon 
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={link.icon}
          />
        )}
        {link.name}
      </Flex>
    </Link>
  );
};

export default NavItem;
