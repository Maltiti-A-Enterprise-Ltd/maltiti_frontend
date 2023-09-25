import { useDispatch } from 'react-redux';
import axios from 'axios';
import { updateAccessToken, updateRoles } from '../actions';

const useRefreshToken = () => {
    const dispatch = useDispatch();

    const refresh = async () => {
        try{
            const [refreshResponse] = await Promise.all([
               axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/token/refresh`, {
                    headers: { 'Content-Type' : 'application/json'},
                    withCredentials: true
                })
            ]);
            dispatch(updateAccessToken(refreshResponse.data.token))
            const requestProfile = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile`, {
                headers: { 
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${refreshResponse.data.token}`,
                },
                withCredentials: true
            });
            dispatch(updateRoles(JSON.parse(requestProfile.data.user).roles))
        }
        catch(err){
            console.log(err)
        }
    }

    return refresh;
}

export default useRefreshToken;