import {
  Flex,
  FormControl,
  Input,
  FormLabel,
  useStyleConfig,
  Button,
  ButtonGroup,
  Icon,
  Box,
} from "@chakra-ui/react";
import { Scrollbars } from "react-custom-scrollbars";
import React, { MouseEventHandler, useMemo, useRef, useState } from "react";
import ModalLayout from "../../../core/layouts/ModalLayout";
import categoryService from "../../models/category/category.service";
import IconWrapper from "../../../core/components/IconWrapper";
import ICategory from "../../models/category/category.interface";
import List from "../../../core/components/List";
import IconButton from "../../../core/components/IconButton";
import icons from "../../../themes/icons";

type CategoryFormProps = {
  onSubmit;
  onCancel;
  category?: ICategory;
};
const CategoryForm = ({ onSubmit, onCancel, category }: CategoryFormProps) => {
  //#region Hooks
  const titleRef = useRef<HTMLInputElement>();
  const [selectedIcon, setSelectedIcon] = useState(null);

  //#endregion

  //#region Handlers
  async function onSubmitHandler(e) {
    e.preventDefault();
    e.stopPropagation();

    const payload = {
      title: titleRef.current.value,
      icon: selectedIcon,
    };
    // to update category

    if (category) {
      await categoryService.updateById(category._id, payload);
    } else {
      // to create category
      await categoryService.create(payload);
    }

    console.log("service call success");

    onSubmit();
  }
  function onClose() {
    onCancel();
  }

  function onIconSelectHandler(name): MouseEventHandler<HTMLDivElement> {
    setSelectedIcon(name);
    return;
  }
  //#endregion

  //#region Style
  const flexStyle = useStyleConfig("Flex");
  //#endregion

  //#region Components

  const formInputs = (
    <FormControl m={3} variant="floating" id="title">
      <Input
        ref={titleRef}
        defaultValue={category && category.title}
        placeholder=" "
      />
      <FormLabel>Title</FormLabel>
    </FormControl>
  );

  const iconViews = useMemo(() => {
    {
      const iconModels = Object.entries(icons);
      return iconModels.map((iconModel) => {
        return {
          id: iconModel[0],
          component: (
            <Box
              id={iconModel[0]}
              key={iconModel[0]}
              m={1}
              p={0}
              cursor="pointer"
            >
              <IconButton
                icon={iconModel[1]}
                size={6}
                hoverColor="brand.regular"
                isSelected={iconModel[0] == selectedIcon}
              />
            </Box>
          ),
          data: iconModel,
        };
      });
    }
  }, [selectedIcon]);
  const selectedIconSelection = (
    <FormControl w="100%" m={3} flexDir="column">
      <FormLabel>Icon</FormLabel>
      <Scrollbars
        className="category-selection__selectedIcon-select-scrollbar"
        style={{ width: "100%", height: 120 }}
        autoHide={false}
        overFlowX="hidden"
      >
        <List
          items={iconViews}
          showEditTools={false}
          onItemSelect={onIconSelectHandler}
          onDeleteClick={undefined}
          onEditClick={undefined}
        />
      </Scrollbars>
    </FormControl>
  );

  const buttons = (
    <ButtonGroup m={10} width="22rem" justifyContent="space-around">
      <Button type="submit" variant="solid">
        Save
      </Button>
      <Button variant="unstyled" onClick={onCancel}>
        Cancel
      </Button>
    </ButtonGroup>
  );
  //#endregion

  return (
    <ModalLayout
      title="Create Category"
      width="550px"
      height="400px"
      haveButton={false}
      show={true}
      onClose={onClose}
    >
      <form
        style={{
          width: "80%",
          height: "100%",
        }}
        onSubmit={onSubmitHandler}
      >
        <Flex __css={flexStyle} flexDir="column">
          {formInputs}
          {selectedIconSelection}
          {buttons}
        </Flex>
      </form>
    </ModalLayout>
  );
};

export default CategoryForm;
