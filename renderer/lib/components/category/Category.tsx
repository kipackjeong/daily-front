import { Text, Flex, IconButtonProps, FlexProps } from "@chakra-ui/react";
import mongoose, { ObjectId } from "mongoose";
import React, { MouseEventHandler, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import IconButton from "@core/components/IconButton";
import icons from "../../../themes/icons";
import { ICategory } from "@lib/models/category";

type CategoryProps = {
  category: ICategory;
  isSelected?;
  showTitle?;
  height?;
  size?;
  fontSize?;
  isHoverable?;
} & FlexProps;
const Category = ({
  category,
  isSelected,
  size = 6,
  showTitle = true,
  height,
  fontSize,
  color = "brand.heavy",
  isHoverable = true,
  ...rest
}: CategoryProps) => {
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

  return category ? (
    <Flex
      id={category._id}
      key={category.title}
      flexDir="column"
      w="50px"
      cursor="pointer"
      alignItems={"center"}
      justifyContent={"center"}
      onMouseEnter={onMouseEnterHandler}
      onMouseOut={onMouseOutHandler}
      {...rest}
    >
      <IconButton
        color={color}
        icon={icons[category.icon]}
        size={size}
        isOnHover={isOnHover || isSelected}
        hoverColor={isHoverable && "brand.regular"}
      />
      {showTitle && (
        <Text
          textAlign="center"
          fontSize="xs"
          width="100%"
          color={(isOnHover && "brand.regular") || color}
          pointerEvents="none"
        >
          {category.title}
        </Text>
      )}
    </Flex>
  ) : (
    <Flex
      id={Math.random().toString()}
      flexDir="column"
      w="50px"
      cursor="pointer"
      alignItems={"center"}
      justifyContent={"center"}
      onMouseEnter={onMouseEnterHandler}
      onMouseOut={onMouseOutHandler}
    >
      <IconButton
        color={color}
        icon={FaQuestionCircle}
        size={size}
        isOnHover={isOnHover || isSelected}
        hoverColor={isHoverable && "brand.regular"}
      />
    </Flex>
  );
};

export default Category;
