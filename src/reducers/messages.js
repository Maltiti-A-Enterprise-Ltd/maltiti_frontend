export const messagesReducer = (state = "", action) => {
  switch (action.type) {
    case "SET_MESSAGE":
      return action.payload;
    case "UNSET_MESSAGE":
      return "";
    default:
      return state;
  }
};

export const messageTypeReducer = (state = "", action) => {
  switch (action.type) {
    case "ERROR":
      return "error";
    case "SUCCESS":
      return "success";
    case "INFO":
      return "info";
    default:
      return state;
  }
};
