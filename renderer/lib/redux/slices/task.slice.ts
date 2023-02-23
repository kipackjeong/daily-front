import { createSlice } from "@reduxjs/toolkit";

import { HYDRATE } from "next-redux-wrapper";
import indexReducer from "../stores";
import { AppState } from "../stores/app.store";
import { stat } from "fs";
import { ITask } from "@lib/models/task";

type SetTaskAction = {
  payload: ITask[];
};

type UpdateTaskAction = {
  payload: ITask;
};

type AddTaskAction = {
  payload: ITask;
};

type SelectTaskAction = {
  payload: string;
};

type DeselectTaskAction = {
  payload: string;
};
type DeleteMultipleTasksAction = {
  payload: string[];
};
type ResetSelectedTasksAction = {};

type MultiSelectTaskAction = {
  payload: string;
};

type DeleteTaskAction = {
  payload: string;
};

export interface TaskState {
  tasks: ITask[];
  selected: string[];
  latest: ITask;
}

// Initial state
const initialState: TaskState = {
  tasks: [],
  selected: [],
  latest: null,
};

// Actual Slice
export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    // Action to set the authentication status
    setTasks(state, action: SetTaskAction) {
      state.tasks = action.payload;
      orderTasksByEndTime(state.tasks);
      refreshLatestTask(state);
    },
    selectTask(state, action: SelectTaskAction) {
      state.selected = [action.payload];
    },

    multiSelectTask(state, action: MultiSelectTaskAction) {
      const newState = { ...state };
      const newSelected = [...newState.selected, action.payload];
      state.selected = newSelected;
    },

    deselectTask(state, action: DeselectTaskAction) {
      const taskId = action.payload;
      state.selected = state.selected.filter((id) => id !== taskId);
    },

    resetSelectedTask(state, action: ResetSelectedTasksAction) {
      state.selected = [];
    },

    addTasks(state, action: AddTaskAction) {
      state.tasks = [...state.tasks, action.payload];
      orderTasksByEndTime(state.tasks);
      refreshLatestTask(state);
    },

    updateTask(state, action: UpdateTaskAction) {
      const prevTaskIdx = state.tasks.findIndex(
        (t) => t._id == action.payload._id
      );
      state.tasks[prevTaskIdx] = {
        ...state.tasks[prevTaskIdx],
        ...action.payload,
      };

      orderTasksByEndTime(state.tasks);
      refreshLatestTask(state);
    },
    deleteAll(state) {
      state.tasks = [];

      return state;
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter((t) => t._id != action.payload);

      orderTasksByEndTime(state.tasks);
      refreshLatestTask(state);
    },

    deleteMultipleTasks(state, action: DeleteMultipleTasksAction) {
      const ids = action.payload;

      state.tasks = state.tasks.filter((t) => !ids.includes(t._id));

      orderTasksByEndTime(state.tasks);
      refreshLatestTask(state);
    },

    deleteLastlyAddedTask(state, action) {
      state.tasks.pop();

      orderTasksByEndTime(state.tasks);
      refreshLatestTask(state);
    },
  },
  extraReducers: {
    [HYDRATE]: indexReducer,
  },
});

//#region helpers
function orderTasksByEndTime(tasks: ITask[]): ITask[] {
  tasks.sort((a, b) => {
    if (a.timeInterval.endTime < b.timeInterval.endTime) {
      return -1;
    } else if (a.timeInterval.endTime > b.timeInterval.endTime) {
      return 1;
    } else {
      return 0;
    }
  });
  return tasks;
}
function refreshLatestTask(state: TaskState): void {
  state.latest = state.tasks.at(-1);
}
//#endregion

export const taskActions = taskSlice.actions;

export const selectTasks = (state: AppState) => state.task.tasks;

export const selectSelectedTasks = (state: AppState) => state.task.selected;

export const selectLatestTask = (state: AppState) => state.task.latest;

export default taskSlice.reducer;
