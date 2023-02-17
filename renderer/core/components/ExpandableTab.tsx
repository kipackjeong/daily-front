import { Card, CardBody } from "@chakra-ui/card";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { Flex, FlexProps, Grid, GridItem } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import IconButton from "./IconButton";

type ExpandableTabProps = {
  title: string;
  isLoading: boolean;
  defaultIsOpen: boolean;
} & FlexProps;

const ExpandableTab = ({
  title,
  isLoading,
  defaultIsOpen,
  children,
  ...rest
}) => {
  const [showItems, setShowItems] = useState(defaultIsOpen);

  function onClickHandler() {
    setShowItems((prev) => !prev);
  }

  return (
    <Card width="30em" paddingY={2} paddingX={2} {...rest}>
      <Flex gap={2}>
        <Text>{title}</Text>
        <IconButton icon={FaAngleDown} onClick={onClickHandler}></IconButton>
      </Flex>

      {showItems && (
        <CardBody width={"fit-content"} {...rest}>
          {children}
        </CardBody>
      )}
    </Card>
  );
};

export default ExpandableTab;
