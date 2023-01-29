import MainLayout from "../core/layouts/MainLayout";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../themes/index";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiHome } from "react-icons/fi";
import { MdCalendarToday } from "react-icons/md";
import SideBar, { LinkItemProps } from "../lib/component/task/TaskForm/atoms/nav/SideBar";
import "./styles.css";
import { appStoreWrapper } from "../lib/redux/stores/app.store";

function MyApp({ Component, pageProps }) {
  // needed inorder for models to be registered before connection DB.

  const LinkItems: Array<LinkItemProps> = [
    { name: "Dashboard", icon: FiHome, link: "/dashboard" },
    {
      name: "Daily",
      icon: MdCalendarToday,
      link: `/dailyboard`,
    },
  ];

  return (
    <ChakraProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <MainLayout>
          <SideBar linkItems={LinkItems} />
          <Component {...pageProps} />
        </MainLayout>
      </DndProvider>
    </ChakraProvider>
  );
}

export default MyApp;
