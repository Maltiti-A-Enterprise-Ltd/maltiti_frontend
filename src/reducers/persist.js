export const persistReducer = (
  state = JSON.parse(localStorage.getItem('persist')) || false,
  action
) => {
  switch (action.type) {
    case 'SET_PERSIST':
      return !state;
    case 'TOGGLE_PERSIST':
      return !state;
    default:
      return state;
  }
};
