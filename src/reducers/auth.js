export const authReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_AUTH':
      return action.payload;
    case 'UPDATE_ACCESS_TOKEN':
      return {
        ...state,
        accessToken: action.payload
      };
    case 'UPDATE_ROLES':
      return {
        ...state,
        roles: action.payload
      };
    default:
      return state;
  }
};
