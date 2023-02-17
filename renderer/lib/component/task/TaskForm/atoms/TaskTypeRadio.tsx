import { RadioGroup, Stack, Radio } from "@chakra-ui/react";
import React from "react";

type TaskTypeRadioProps = {
  value: string;
  onChange?;
};
const TaskTypeRadio = ({ value, onChange }: TaskTypeRadioProps) => {
  return (
    <RadioGroup mt={3} defaultValue={value} onChange={onChange}>
      <Stack spacing={5} direction="row">
        <Radio colorScheme="green" value="To Do">
          To Do
        </Radio>
        <Radio colorScheme="blue" value="Did">
          Did
        </Radio>
      </Stack>
    </RadioGroup>
  );
};

export default TaskTypeRadio;
