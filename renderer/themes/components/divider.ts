import { defineStyleConfig } from "@chakra-ui/react";
import colors from "../colors";

const Divider = defineStyleConfig({
  baseStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  variants: {
    taskBlockDivider: {
      zIndex: 2,
      position: "absolute",
      bottom: "0px",
      left: "0px",
      borderBottomWidth: "5px",
      borderColor: colors.brand.blue[50],
      cursor: "pointer",
      _hover: {
        borderColor: colors.brand.blue[50],
      },
    },
    timeBlockDivider: {
      width: "100%",
      borderBottomWidth: "2px",
      borderColor: "#EAEAEA",
      cursor: "pointer",
    },
    currentTimeLine: {
      left: "0px",
      borderBottomWidth: "5px",
      borderColor: colors.brand.blue[200],
      cursor: "pointer",
    },
  },
});

export default Divider;
