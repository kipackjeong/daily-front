import { defineStyleConfig } from "@chakra-ui/react";
import colors from "../colors";

const Button = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    fontWeight: "bold",
    borderRadius: "8.88554px", // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
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
  // Two variants: outline and solid
  variants: {
    outline: {
      borderColor: colors.brand.heavy,
      color: colors.brand.heavy,

      backgroundColor: "white",
      _hover: {
        color: "white",
        backgroundColor: colors.brand.heavy,
      },
    },
    solid: {
      bg: colors.brand.blue[300],
      color: "white",
    },
    solidRed: {
      bg: colors.brand.red[600],
      color: "white",
    },
    naked: {},
    nakedBlue: {
      _hover: {
        color: colors.brand.blue[300],
      },
    },
    nakedGreen: {
      _hover: {
        color: colors.brand.green[300],
      },
    },
    nakedRed: {
      _hover: {
        color: colors.brand.red[300],
      },
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "outline",
  },
});

export default Button;
