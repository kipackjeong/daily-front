import {
  useDisclosure,
  Drawer,
  DrawerContent,
  CloseButton,
  useColorModeValue,
  Flex,
  Text,
  BoxProps,
  useStyleConfig,
} from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { FiHome } from "react-icons/fi";
import { MdCalendarToday } from "react-icons/md";
import MobileNav from "./MobileNav";
import NavItem from "./NavItem";

const SideBar = ({ linkItems }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const containerStyle = useStyleConfig("Flex", { variant: "sideBar" });
  return (
    <Flex
      className="side-bar"
      __css={containerStyle}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
    >
      <SidebarContent
        linkItems={linkItems}
        onClose={() => onClose}
        display={{ base: "flex", md: "flex" }}
      />

      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent className="side-bar-drawer-content">
          <SidebarContent linkItems={linkItems} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
    </Flex>
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
      w={{ base: "80%" }}
      pos="relative"
      h="100%"
      m="auto"
      flexDir={"column"}
      justifyContent={"flex-start"}
      alignItems="flex-start"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {linkItems.map((link) => (
        <NavItem key={link.name} link={link} />
      ))}
    </Flex>
  );
};

export default SideBar;
