import { Flex, HStack, Stack, VStack } from "@chakra-ui/react";
import ModalLayout from "@core/layouts/ModalLayout";
import React from "react";
import AppColors from "themes/colors";

/**
 * This is only for development
 * @returns
 */
const AppColorPanel = () => {
  return (
    <ModalLayout haveButton={true}>
      <HStack height="100%" width="100%">
        <VStack height="100%">
          {Object.entries(AppColors.brand.blue).map((kv) => (
            <Flex
              backgroundColor={kv[1]}
              color="black"
              width="150px"
              height="100px"
            >
              {kv[0]}
            </Flex>
          ))}
        </VStack>
        <VStack height="100%">
          {Object.entries(AppColors.brand.red).map((kv) => (
            <Flex
              backgroundColor={kv[1]}
              color="black"
              width="150px"
              height="100px"
            >
              {kv[0]}
            </Flex>
          ))}
        </VStack>
        <VStack height="100%">
          {Object.entries(AppColors.brand.green).map((kv) => (
            <Flex
              backgroundColor={kv[1]}
              color="black"
              width="150px"
              height="100px"
            >
              {kv[0]}
            </Flex>
          ))}
        </VStack>
        <VStack height="100%">
          {Object.entries(AppColors.brand.yellow).map((kv) => (
            <Flex
              backgroundColor={kv[1]}
              color="black"
              width="150px"
              height="100px"
            >
              {kv[0]}
            </Flex>
          ))}
        </VStack>
      </HStack>
    </ModalLayout>
  );
};

export default AppColorPanel;
