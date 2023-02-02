import { Flex, Spinner } from "@chakra-ui/react";
import React from "react";

const FullPageSpinner = () => {
  return (
    <Flex
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Spinner></Spinner>
    </Flex>
  );
};

export default FullPageSpinner;
