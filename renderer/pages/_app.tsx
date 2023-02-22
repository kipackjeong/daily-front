import MainLayout from "@core/layouts/MainLayout";
import { ChakraProvider, Flex, Spinner } from "@chakra-ui/react";
import theme from "../themes/index";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./global.css";
import { useAppStatus } from "@lib/hooks/useAppStatus";
import { appStoreWrapper } from "@lib/redux/stores/app.store";
import { Provider } from "react-redux";

function MyApp({ Component, pageProps }) {
  const { isOnline } = useAppStatus();
  const { store } = appStoreWrapper.useWrappedStore({});

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
