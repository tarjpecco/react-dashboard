import axios from 'axios';
import { API_URL } from './';

export const signUp = (newUserData) => {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };
    return axios.post(`${ API_URL }/users/`, newUserData, { headers })
        .then((res) => {
            return res.data;
        })
};
