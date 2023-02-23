import { Box, Flex, FlexProps, Icon, useStyleConfig } from "@chakra-ui/react";
import Link from "next/link";
import { LinkItemProps } from "./SideBar";

interface NavItemProps extends FlexProps {
  link: LinkItemProps;
}

const NavItem = ({ link }: NavItemProps) => {
  const containerStyle = {
    alignItems: "center",
    justifyContent: "flex-start",
    p: "4",
    mx: "4",
    borderRadius: "lg",
    role: "group",
    cursor: "pointer",
    _hover: {
      bg: "brand.blue.400",
      color: "white",
    },
  };

  return (
    <Link href={link.link} style={{ textDecoration: "none" }}>
      <Flex __css={containerStyle} color={"brand.heavy"}>
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
