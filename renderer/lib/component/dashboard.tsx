import {
  Flex,
  Heading,
  Grid,
  GridItem,
  Card,
  CardBody,
  useMediaQuery,
  Drawer,
} from "@chakra-ui/react";
import React from "react";
import BarChart from "../../core/components/BarChart";
import DoughnutChart from "../../core/components/DoughnutChart";
import DailyBoard from "./dailyboard";

import Scrollbars from "react-custom-scrollbars";
import ModalLayout from "../../core/layouts/ModalLayout";

const DashBoard = () => {
  console.log("DashBoard renders");
  const [isLargerThan30EM] = useMediaQuery("(min-width: 30em)");
  console.log("isLargerThan30EM: " + isLargerThan30EM);
  return (
    <Scrollbars
      className="category-selection__selectedIcon-select-scrollbar"
      style={{ width: "100%", height: "100%" }}
      autoHide={false}
      overFlowX="hidden"
    >
      <Flex flexDirection={{ sm: "column", md: "row", lg:"row" }}>
        <Flex flex={1} h="100%" flexDir="column">
          <Heading>Dashboard</Heading>
          <Grid
            w="100%"
            h="100%"
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(3, 1fr)"
            gap={4}
          >
            <GridItem colSpan={1}>
              <Card w="100%" h="100%">
                <CardBody></CardBody>
              </Card>
            </GridItem>
            <GridItem colSpan={2}>
              <Card w="100%" h="100%">
                <CardBody w="100%" h="100%">
                  <BarChart />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem colSpan={1}>
              <Card w="100%" h="100%">
                <CardBody></CardBody>
              </Card>
            </GridItem>
            <GridItem colSpan={2}>
              <Card w="100%" h="100%">
                <CardBody>
                  <DoughnutChart />
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </Flex>

        <Flex
          flex={1}
          w="100%"
          h="100%"
          flexDir={"column"}
          ml={{ base: 5, sm: 0 }}
        >
          {!isLargerThan30EM ? (
            <ModalLayout
              onClose={function (): void {
                throw new Error("Function not implemented.");
              }}
            >
              <Card w="100%" h={{ base: "100%", sm: "800px" }}>
                <CardBody p={0}>
                  <DailyBoard isMini={true} />
                </CardBody>
              </Card>
            </ModalLayout>
          ) : (
            <Card w="100%" h={{ base: "100%", sm: "800px" }}>
              <CardBody p={0}>
                <DailyBoard isMini={true} />
              </CardBody>
            </Card>
          )}
        </Flex>
      </Flex>
    </Scrollbars>
  );
};

export default DashBoard;
