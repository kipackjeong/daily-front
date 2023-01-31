import { Text, Flex, IconButtonProps, FlexProps } from "@chakra-ui/react";
import mongoose, { ObjectId } from "mongoose";
import React, {
  MouseEventHandler,
  ReactElement,
  useEffect,
  useState,
} from "react";
import IconButton from "../../../core/components/IconButton";
import icons from "../../../themes/icons";
import ICategory from "../../models/category/category.interface";

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
  height = "50px",
  fontSize,
  color = "brand.heavy",
  isHoverable = true,
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

  return (
    <Flex
      id={category._id}
      key={category.title}
      flexDir="column"
      w="50px"
      h={height}
      cursor="pointer"
      alignItems={"center"}
      justifyContent={"center"}
      onMouseEnter={onMouseEnterHandler}
      onMouseOut={onMouseOutHandler}
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
  );
};

export default Category;
