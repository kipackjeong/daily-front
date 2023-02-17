import {
  useDisclosure,
  Drawer,
  DrawerContent,
  useColorModeValue,
  Flex,
  Text,
  BoxProps,
  useStyleConfig,
  DrawerCloseButton,
} from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { FaUser } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { useAppStatus } from "../../../../../hooks/useAppStatus";
import MobileNav from "./MobileNav";
import NavItem from "./NavItem";

const SideBar = () => {
  const { isOnline } = useAppStatus();

  const linkItems: Array<LinkItemProps> = [
    { name: "Home", icon: FiHome, link: "/home" },
    isOnline
      ? { name: "Logout", icon: FaUser, link: "/logout" }
      : { name: "Login", icon: FaUser, link: "/login" },
    // {
    //   name: "Daily",
    //   icon: MdCalendarToday,
    //   link: `/dailyboard`,
    // },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const containerStyle = useStyleConfig("Flex", { variant: "sideBar" });
  return (
    <>
      <Flex
        className="side-bar"
        display={{ base: "none", sm: "none", md: "flex" }}
        __css={containerStyle}
        borderRight="1px"
        borderRightColor={useColorModeValue("gray.200", "gray.700")}
      >
        <SidebarContent
          linkItems={linkItems}
          onClose={() => onClose}
          display={{ base: "flex", md: "flex" }}
        />
      </Flex>

      {/* mobilenav */}
      <Flex>
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="xs"
        >
          <DrawerContent className="side-bar-drawer-content">
            <SidebarContent linkItems={linkItems} onClose={onClose} />
            <DrawerCloseButton zIndex={1} onClick={onClose} />
          </DrawerContent>
        </Drawer>

        <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      </Flex>
    </>
  );
};

export interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}
interface SidebarProps extends BoxProps {
  linkItems;
  onClose: () => void;
}

const SidebarContent = ({ linkItems, onClose }: SidebarProps) => {
  return (
    <Flex
      className="side-bar_content"
      bg={useColorModeValue("white", "gray.900")}
      w={{ base: "50%", sm: "80%", md: "100%" }}
      pos="relative"
      h="100%"
      m={{ base: "none", md: "auto" }}
      flexDir={"column"}
      justifyContent={"flex-start"}
      alignItems="flex-start"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
      </Flex>
      {linkItems.map((link) => (
        <NavItem key={link.name} link={link} />
      ))}
    </Flex>
  );
};

export default SideBar;
