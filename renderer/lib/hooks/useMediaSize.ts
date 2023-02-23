import { useMediaQuery } from "@chakra-ui/react";
import { useMemo } from "react";

const useMediaSize = () => {
  const [isBase, isSM, isMD, isLG, isXL] = useMediaQuery([
    "(min-width: 0em) and (max-width: 29em)",
    "(min-width: 30em) and (max-width: 47em)",
    "(min-width: 48em) and (max-width: 61em)",
    "(min-width: 62em) and (max-width: 79em)",
    "(min-width: 80em) ",
  ]);

  const smallerEqualToMD = isBase || isSM || isMD;

  return { isBase, isSM, isMD, isLG, isXL, smallerEqualToMD };
};

export default useMediaSize;
