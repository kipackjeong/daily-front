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
import { appStoreWrapper } from "../lib/redux/stores/app.store";
import { Provider } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosInstance from "../lib/utils/axios";
import { userActions } from "../lib/redux/slices/user.slice";

function MyApp({ Component, pageProps }) {
  const { isOnline } = useAppStatus();
  const { store } = appStoreWrapper.useWrappedStore({});

  const user = store.getState().user.user;

  const dispatch = store.dispatch;

  const router = useRouter();



  return isOnline != null ? (
    <ChakraProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <Provider store={store}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </Provider>{" "}
      </DndProvider>
    </ChakraProvider>
  ) : (
    <Flex w="100vw" h="100vh" justifyContent="center" alignItems="center">
      <Spinner m="auto" height="100px" />
    </Flex>
  );
}

export default MyApp;
