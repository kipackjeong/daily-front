import { Flex, HStack } from "@chakra-ui/layout";
import { useRadioGroup, FormLabel, RadioProps } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import RadioCard from "../../../../../core/components/RadioCard";

type PriorityRadioCard = {
  defaultValue?: number;
  onChange: (nextValue: string) => void;
};

const PriorityRadioCard = ({
  defaultValue = 2,
  onChange: onChangeFromParent,
}: PriorityRadioCard) => {
  const options = [
    { label: "Low", value: 3 },
    { label: "Med", value: 2 },
    { label: "High", value: 1 },
  ];
  const styleOptions = [
    { borderColor: "brand.red.300" },
    { borderColor: "brand.yellow.300" },
    {
      borderColor: "brand.green.300",
    },
  ];
  //   const [priority, setPriority] = useState(null);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "framework",
    defaultValue: defaultValue,
    onChange: onChangeFromParent,
  });

  const group = getRootProps();

  return (
    <Flex flexDir="column" w="100%">
      <FormLabel m={0}>Priority</FormLabel>
      <HStack w="100%" {...group} justifyContent="center">
        {options.map((option, i) => {
          const radio = getRadioProps(option);
          return (
            <RadioCard
              key={option.label}
              my={3}
              {...radio}
              {...styleOptions[i]}
            >
              {option.label}
            </RadioCard>
          );
        })}
      </HStack>
    </Flex>
  );
};

export default PriorityRadioCard;
