import MainLayout from "../core/layouts/MainLayout";
import { ChakraProvider, Flex, Spinner } from "@chakra-ui/react";
import theme from "../themes/index";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiHome } from "react-icons/fi";
import { MdCalendarToday } from "react-icons/md";
import SideBar, {
  LinkItemProps,
} from "../lib/component/task/TaskForm/atoms/nav/SideBar";
import "./styles.css";
import { useAppStatus } from "../lib/hooks/useAppStatus";
import { FaUser } from "react-icons/fa";

function MyApp({ Component, pageProps }) {
  const { isOnline } = useAppStatus();

  const LinkItems: Array<LinkItemProps> = [
    { name: "Home", icon: FiHome, link: "/home" },
    { name: "Login", icon: FaUser, link: "/login" },
    // {
    //   name: "Daily",
    //   icon: MdCalendarToday,
    //   link: `/dailyboard`,
    // },
  ];

  return isOnline != null ? (
    <ChakraProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <MainLayout>
          <SideBar linkItems={LinkItems} />
          <Component {...pageProps} />
        </MainLayout>
      </DndProvider>
    </ChakraProvider>
  ) : (
    <Flex w="100vw" h="100vh" justifyContent="center" alignItems="center">
      <Spinner m="auto" height="100px" />
    </Flex>
  );
}

export default MyApp;
