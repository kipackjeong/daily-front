import { Card, CardBody } from "@chakra-ui/card";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { Flex, FlexProps, Grid, GridItem } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Rnd } from "react-rnd";
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
  className,
  ...rest
}) => {
  const [showItems, setShowItems] = useState(defaultIsOpen);

  function onClickHandler() {
    setShowItems((prev) => !prev);
  }

  return (
    <Card className={className} paddingY={2} paddingX={1} {...rest}>
      <Flex className={className + "__title-icon-cont"} gap={2}>
        <Text>{title}</Text>
        {showItems ? (
          <IconButton icon={FaAngleUp} onClick={onClickHandler} />
        ) : (
          <IconButton icon={FaAngleDown} onClick={onClickHandler} />
        )}
      </Flex>

      {showItems && (
        <CardBody
          className={className + "__card-body"}
          width={"fit-content"}
          {...rest}
        >
          {children}
        </CardBody>
      )}
    </Card>
  );
};

export default ExpandableTab;
