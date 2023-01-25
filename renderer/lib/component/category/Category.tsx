import { Text, Flex } from "@chakra-ui/react";
import mongoose, { ObjectId } from "mongoose";
import React, { MouseEventHandler, useEffect, useState } from "react";
import IconButton from "../../../core/components/IconButton";
import icons from "../../../themes/icons";
import ICategory from "../../models/category/category.interface";

type CategoryProps = {
  category: ICategory;
  isSelected?;
  hasTitle?;
};
const Category = ({ category, isSelected }: CategoryProps) => {
  const [isOnHover, setisOnHover] = useState(false);

  //#region Handlers

  function onMouseOutHandler(e): MouseEventHandler<HTMLDivElement> {
    e.stopPropagation();

    if (isOnHover) {
      setisOnHover(false);
    }
    return;
  }
  function onMouseEnterHandler(e): MouseEventHandler<HTMLDivElement> {
    e.stopPropagation();

    if (!isOnHover) {
      setisOnHover(true);
    }
    return;
  }
  //#endregion

  return (
    <Flex
      id={category._id}
      key={category.title}
      flexDir="column"
      w="50px"
      h="50px"
      cursor="pointer"
      alignItems={"center"}
      onMouseEnter={onMouseEnterHandler}
      onMouseOut={onMouseOutHandler}
    >
      <IconButton
        icon={icons[category.icon]}
        size={6}
        isOnHover={isOnHover || isSelected}
        hoverColor={"brand.regular"}
      />
      <Text
        textAlign="center"
        fontSize="xs"
        width="100%"
        color={isOnHover || isSelected ? "brand.regular" : "brand.heavy"}
        pointerEvents="none"
      >
        {category.title}
      </Text>
    </Flex>
  );
};

export default Category;
