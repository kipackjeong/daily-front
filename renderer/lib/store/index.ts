import logger from "../../utils/logger";

const indexReducer = (state, action) => {
  logger.info("indexReducer");

  const newState = { ...state };
  newState.date.dates = [...action.payload.date.dates];
  newState.date.selectedDate = { ...action.payload.date.selectedDate };
  newState.task.tasks = [...action.payload.task.tasks];
  return newState;
};

export default indexReducer;
