import { useDispatch } from 'react-redux';
import axios from 'axios';
import { updateRoles } from '../actions';
import { axiosPrivate } from './axios';

const Profile = () => {
  const dispatch = useDispatch();

  const profile = async () => {
    const response = await axiosPrivate.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile`, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
    console.log(response.data.user);
    dispatch(updateRoles(response.data.user.roles));
    return response.data.token;
  };
  return profile;
};

export default Profile;
