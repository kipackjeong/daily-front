import {
  Flex,
  Text,
  Heading,
  Grid,
  GridItem,
  Card,
  CardBody,
  chakra,
} from "@chakra-ui/react";
import React from "react";
import Scrollbars from "react-custom-scrollbars";
import NextTab from "./next-tab/NextTab";
import PriorityTab from "./priority-tab/PriorityTab";

const DashBoard = () => {
  console.log("DashBoard renders");

  const Section = ({ children }) => {
    return (
      <Flex my={5} flexDir={"column"}>
        {children}
      </Flex>
    );
  };

  return (
    <Scrollbars
      className="category-selection__selectedIcon-select-scrollbar"
      style={{ width: "100%", height: "100%" }}
      autoHide={false}
      overflowX="hidden"
    >
      <Flex flexDirection="column">
        <Section>
          <PriorityTab />
        </Section>
        <Section>
          <NextTab />
        </Section>
        {/* <Section>
          <Text>Recently Added</Text>
        </Section>
        <Section>
          <Text>MyWork</Text>
        </Section>
        <Section>
          <Text>Overdue</Text>
        </Section>

        <Section>
          <Text>Unscheduled</Text>
        </Section> */}
      </Flex>
      {/* <Flex flexDirection={{ sm: "column", md: "row", lg: "row" }}>
        <Flex flex={1} h={{ base: "100%", sm: "61em" }} flexDir="column">
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
      </Flex> */}
    </Scrollbars>
  );
};

export default DashBoard;
