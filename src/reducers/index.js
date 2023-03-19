import { combineReducers } from "redux";
import { messagesReducer, messageTypeReducer } from "./messages";
import spinnerReducer from "./spinner";
import { loggedInReducer } from "./login";
import { searchReducer } from "./search";
import { authReducer } from "./auth";

const allReducers = combineReducers({
    spinner: spinnerReducer,
    messages: messagesReducer,
    messageType: messageTypeReducer,
    loggedIn: loggedInReducer,
    search: searchReducer,
    auth: authReducer
})

export default allReducers;