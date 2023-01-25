import { Flex } from "@chakra-ui/react";
import React from "react";

const MainLayout = ({ children }) => {
  return (
    <Flex className="main-layout" flexDir="row" height="100vh" width="100vw">
      {children}
    </Flex>
  );
};

export default MainLayout;
