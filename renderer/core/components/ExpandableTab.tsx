import { Card, CardBody } from "@chakra-ui/card";
import { Flex, FlexProps } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import IconButton from "./buttons/IconButton";

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
}: ExpandableTabProps) => {
  const [showItems, setShowItems] = useState(defaultIsOpen);

  function onClickHandler() {
    setShowItems((prev) => !prev);
  }

  return (
    <Card className={className} paddingY={2} paddingX={1} {...rest}>
      <Flex className={className + "__title-icon-cont"} pl="1em" gap={2}>
        <Text className={className + "__title-icon-cont__title"}>{title}</Text>
        {showItems ? (
          <IconButton
            className={className + "__title-icon-cont__up-icon"}
            icon={FaAngleUp}
            onClick={onClickHandler}
          />
        ) : (
          <IconButton
            className={className + "__title-icon-cont__down-icon"}
            icon={FaAngleDown}
            onClick={onClickHandler}
          />
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
