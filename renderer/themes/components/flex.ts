import { color, defineStyleConfig } from "@chakra-ui/react";
import colors from "../colors";

const Flex = defineStyleConfig({
  baseStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  variants: {
    dateSelectionBarBox: {
      bg: colors.brand.lightGray,
      flexDir: "column",
      flex: 0.7,
      w: "100%",
      padding: 2,
    },
    dateBox: {
      flexDir: "column",
      borderRadius: "5px",
      p: 2,
    },
    "dateBox-highlight": {
      flexDir: "column",
      borderRadius: "5px",
      p: 2,
      bg: colors.brand.heavy,
      color: "white",
    },
    taskBlockBox: {
      zIndex: 2,
      position: "absolute",
      w: "100%",
      height: "100%",
      display: "flex",
      flexDir: "column",
      color: colors.brand.heavy,

      _hover: {
        backgroundColor: colors.brand.regular,
      },
      cursor: "pointer",
    },

    sideBar: {
      h: "100%",
      minW: "250px",
      color: colors.brand.heavy,
    },

    navItem: {
      alignItems: "center",
      justifyContent: "flex-start",
      p: "4",
      mx: "4",
      borderRadius: "lg",
      role: "group",
      cursor: "pointer",
      _hover: {
        bg: "cyan.400",
        color: "white",
      },
    },

    curTimeMarkLineContainer: {
      w: "95%",
      position: "absolute",
      left: 8,
      zIndex: 10,
    },

    curTimeMarkLineTextBox: {
      color: "brand.regular",
      w: "100%",
      textAlign: "center",
      position: "absolute",
    },

    timePickerContainer: {
      fontSize: "4xl",
      width: "100%",
      flexDir: "row",
      justifyContent: "space-around",
    },
  },

  sizes: {
    sm: {
      fontSize: "sm",
      px: 4, // <-- px is short for paddingLeft and paddingRight
      py: 3, // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: "md",
      px: 6, // <-- these values are tokens from the design system
      py: 4, // <-- these values are tokens from the design system
    },
  },
});

export default Flex;
