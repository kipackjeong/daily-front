import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { taskSlice } from "../slices/task.slice";
import { logger } from "redux-logger";
import { dateSlice } from "../slices/date.slice";

const makeStore = () =>
  configureStore({
    reducer: {
      [taskSlice.name]: taskSlice.reducer,
      [dateSlice.name]: dateSlice.reducer,
    },

    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(logger),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const appStoreWrapper = createWrapper<AppStore>(makeStore);
