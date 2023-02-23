import { useDisclosure, Button, Card } from "@chakra-ui/react";

import React, { Component, useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";

type ModalLayoutProps = {
  title?: string;
  width?: string;
  height?: string;
  direction?: string;
  show?: boolean;
  noHeader?: boolean;
  onClose?: VoidFunction;
  haveButton?: boolean;
  children?;
};
const ModalLayout = ({
  title,
  width,
  height,
  direction,
  noHeader = false,
  show = false,
  onClose: onCloseFromParent = null,
  haveButton = false,
  children,
}: ModalLayoutProps) => {
  const [isOpen, setIsOpen] = useState(show);

  const { onOpen, onClose } = useDisclosure({
    onClose: () => {
      onCloseFromParent && onCloseFromParent();

      setIsOpen(false);
    },
    onOpen: () => {
      setIsOpen(true);
    },
  });

  return (
    <>
      {haveButton && <Button onClick={onOpen}>Open Modal</Button>}
      <Drawer size="full" isOpen={isOpen} placement="top" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent
            width={`${width ? width : "100%"}`}
            height={`${height ? height : "100%"}`}
            margin="auto"
          >
            <DrawerCloseButton zIndex={1} onClick={onClose} />
            {!noHeader && <DrawerHeader pb={0}>{title}</DrawerHeader>}
            <DrawerBody
              sx={{
                w: "100%",
                h: "100%",
                display: "flex",
                flexDir: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {children}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default ModalLayout;
