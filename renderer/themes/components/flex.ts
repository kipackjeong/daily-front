import { color, defineStyleConfig } from "@chakra-ui/react";
import colors from "../colors";

const Flex = defineStyleConfig({
  baseStyle: {
    margin: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  variants: {
    sideBar: {
      h: "100%",
      w: { base: "100px", md: "200px" },
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
