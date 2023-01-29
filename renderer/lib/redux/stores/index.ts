const indexReducer = (state, action) => {
  const newState = { ...state };
  newState.date.date = { ...action.payload.date.date };
  newState.date.dates = [...action.payload.date.dates];
  newState.task.tasks = [...action.payload.task.tasks];
  newState.task.selected = [...action.payload.task.selected];
  newState.task.latest = { ...action.payload.task.latest };

  return newState;
};

export default indexReducer;
