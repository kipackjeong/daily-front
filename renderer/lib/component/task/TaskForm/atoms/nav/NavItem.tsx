import { Box, Flex, FlexProps, Icon, useStyleConfig } from "@chakra-ui/react";
import Link from "next/link";
import { LinkItemProps } from "./SideBar";

interface NavItemProps extends FlexProps {
  link: LinkItemProps;
}

const NavItem = ({ link }: NavItemProps) => {
  const containerStyle = useStyleConfig("Flex", { variant: "navItem" });
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
