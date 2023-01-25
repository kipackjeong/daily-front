import MainLayout from "../core/layouts/MainLayout";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../themes/index";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiHome } from "react-icons/fi";
import { MdCalendarToday } from "react-icons/md";
import { useEffect, useMemo } from "react";
import { getTodayDate } from "../lib/utils/helper";
import SideBar, { LinkItemProps } from "../lib/component/nav/SideBar";
import "./styles.css";
import { AppDate, DateModel } from "../lib/models/app-date";
import CategoryModel from "../lib/models/category/category.model";
import { TaskModel } from "../lib/models/task";
import { appStoreWrapper } from "../lib/store/app.store";
import { useDispatch } from "react-redux";
import { setDates } from "../lib/models/app-date/app-date.slice";

function MyApp({ Component, pageProps }) {
  // needed inorder for models to be registered before connection DB.
  const models = [TaskModel, CategoryModel, DateModel];
  
  const todayDateStr = useMemo(() => {
    const todayDate = getTodayDate();
    const yyyy = todayDate.getFullYear();
    const mm = todayDate.getMonth() + 1;
    const dd = todayDate.getDate();

    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const LinkItems: Array<LinkItemProps> = [
    { name: "Dashboard", icon: FiHome, link: "/dashboard" },
    {
      name: "Daily",
      icon: MdCalendarToday,
      link: `/dailyboard/${todayDateStr}`,
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

export default appStoreWrapper.withRedux(MyApp);
