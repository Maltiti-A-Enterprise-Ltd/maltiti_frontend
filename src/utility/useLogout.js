import { useDispatch } from "react-redux";
import { setAuth } from "../actions";
import axios from "./axios";

const useLogout = () => {
    const dispatch = useDispatch()

    const logout = async () => {
        dispatch(setAuth({}))
        console.log("Yes")
        try {
            await axios('/api/token/invalidate', {
                withCredentials: true
            });
        } catch (error) {
            console.error(error);
        }
    }

    return logout;
}

export default useLogout