import { Flex, FlexProps } from "@chakra-ui/react";
import React from "react";

interface PageLayoutProps extends FlexProps {}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <Flex
      className="page-layout"
      height="100%"
      width="100%"
      pt={5}
      pl={5}
      pr={5}
      pb={5}
      flexDir="column"
      position="relative"
    >
      {children}
    </Flex>
  );
};

export default PageLayout;
