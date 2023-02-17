import { Flex } from "@chakra-ui/react";
import React from "react";
import { Scrollbars } from "react-custom-scrollbars";
import styles from "./styles.module.css";

const Scrollbar = ({ ...rest }) => {
  return <Scrollbars className={styles.scrollbar} {...rest}></Scrollbars>;
};

export default Scrollbar;
