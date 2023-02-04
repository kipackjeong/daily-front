import {
  useDisclosure,
  chakra,
  Spinner,
  Card,
  CardBody,
  Flex,
  VStack,
  Box,
  Text,
  FlexProps,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import FullPageSpinner from "./FullPageSpinner";

type TabProps = { title; isLoading; defaultIsOpen } & FlexProps;
const Tab = ({
  title,
  isLoading,
  defaultIsOpen,
  height,
  children,
  ...rest
}: TabProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: defaultIsOpen,
  });
  const [tabContent, setTabContent] = useState("This is some default content");

  const ShowTabIcon = chakra(FaCaretDown);
  const HideTabIcon = chakra(FaCaretUp);

  return (
    <Card>
      <CardBody>
        <Box>
          <Flex alignItems={"center"}>
            <Text>{title}</Text>
            <Box h="50%" onClick={isOpen ? onClose : onOpen} cursor="pointer">
              {isOpen ? (
                <HideTabIcon color="gray.400" />
              ) : (
                <ShowTabIcon color="gray.400" />
              )}
            </Box>
          </Flex>

          <VStack pt={2} display={isOpen ? "block" : "none"} height={height}>
            {isLoading ? (
              <Flex justifyContent={"center"} h="100%" alignItems="center">
                <Spinner />
              </Flex>
            ) : (
              children
            )}
          </VStack>
        </Box>
      </CardBody>
    </Card>
  );
};

export default Tab;
