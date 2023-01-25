import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../../store/app.store";
import IAppDate from "./app-date.interface";

// Type for our state
export interface DateState {
  dates: IAppDate[];
  selectedDate: IAppDate;
}

// Initial state
const initialState: DateState = {
  dates: [],
  selectedDate: null,
};

// Date Slice
export const dateSlice = createSlice({
  name: "date",
  initialState,

  reducers: {
    setDates(state, action) {
      state.dates = action.payload;
    },

    addDates(state, action) {
      state.dates = [...state.dates, ...action.payload];
    },

    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
  },
});

export const { setDates, addDates, setSelectedDate } = dateSlice.actions;

export const selectDates = (state: AppState) => state.date.dates;

export const selectSelectedDate = (state: AppState) => state.date.selectedDate;

export default dateSlice.reducer;
