import { combineReducers } from "redux";
import { messagesReducer, messageTypeReducer } from "./messages";
import spinnerReducer from "./spinner";
import { loggedInReducer } from "./login";
import { searchReducer } from "./search";
import { authReducer } from "./auth";
import { productsReducer } from "./products";
import { persistReducer } from "./persist";

const allReducers = combineReducers({
  spinner: spinnerReducer,
  messages: messagesReducer,
  messageType: messageTypeReducer,
  loggedIn: loggedInReducer,
  search: searchReducer,
  auth: authReducer,
  products: productsReducer,
  persist: persistReducer,
});

export default allReducers;
