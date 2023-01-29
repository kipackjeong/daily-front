import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { getOneWeekDates, getTodayDate } from "../../utils/helper";
import indexReducer from "../stores";
import { AppState } from "../stores/app.store";

type SetDateAction = {
  payload: Date;
};
type SetDatesAction = {
  payload: Date;
};

const initialState = {
  date: getTodayDate(),
  dates: getOneWeekDates(getTodayDate()),
};
// Actual Slice
export const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    // Action to set the authentication status
    setDate(state, action: SetDateAction) {
      state.date = action.payload;
    },
    setDates(state, action: SetDatesAction) {
      state.dates = getOneWeekDates(action.payload);
    },
  },
  extraReducers: {
    [HYDRATE]: indexReducer,
  },
});

export const dateActions = dateSlice.actions;

export const selectDate = (state: AppState | AppState) => state.date.date;

export const selectDates = (state: AppState | AppState) => state.date.dates;
