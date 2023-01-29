import {
  Flex,
  Heading,
  Grid,
  GridItem,
  Card,
  CardBody,
} from "@chakra-ui/react";
import React from "react";
import BarChart from "../../core/components/BarChart";
import DoughnutChart from "../../core/components/DoughnutChart";
import dashBoard from "../../pages/dashboard";
import { appStoreWrapper } from "../redux/stores/app.store";
import { getTodayDateStr } from "../utils/helper";
import DailyBoard from "./dailyboard";

const DashBoard = () => {
  console.log("DashBoard renders");

  return (
    <Flex sx={{ w: "100%", h: "100%" }}>
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

      <Flex flex={0.1} h="100%" flexDir={"column"} ml={5}>
        <Card w="100%" h="100%">
          <CardBody h="100%">
            <DailyBoard isMini={true} />
          </CardBody>
        </Card>
      </Flex>
    </Flex>
  );
};

export default DashBoard;
