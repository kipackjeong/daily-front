import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import IconButton from "./buttons/IconButton";

type listProps = {
  items: any[];
  isEditable?: boolean;
  showEditTools: boolean;
  onItemSelect;
  onDeleteClick?;
  onEditClick?;
};
const List = ({
  items,
  isEditable = true,
  showEditTools,
  onItemSelect,
  onDeleteClick,
  onEditClick,
}: listProps) => {
  function onItemClickHandler(itemId: string) {
    onItemSelect(itemId);
  }

  return (
    <Flex flexDirection="row" gap={5} flexWrap={"wrap"} alignItems="center">
      {items.map((item, i) => {
        return (
          <Box
            key={item.id}
            position="relative"
            onClick={() => {
              onItemClickHandler(item.id);
            }}
          >
            {item.component}
            {isEditable && showEditTools && (
              <Flex
                style={{
                  flexDirection: "column",
                  position: "absolute",
                  left: "50px",
                  top: "0px",
                }}
              >
                <IconButton
                  icon={FaTrash}
                  color="brand.red.300"
                  hoverColor="brand.red.600 "
                  size={3}
                  onClick={() => onDeleteClick(item.data)}
                />
                <IconButton
                  icon={FaPencilAlt}
                  color={"brand.blue.50"}
                  hoverColor={"brand.blue.200"}
                  size={3}
                  onClick={() => {
                    onEditClick(item.data);
                  }}
                />
              </Flex>
            )}
          </Box>
        );
      })}
    </Flex>
  );
};

export default List;
