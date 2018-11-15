import axios from 'axios';
import AuthHeaderService from './auth-header';

export const API_URL = process.env.REACT_APP_API_URL || 'http://flexapi.nanoapp.io/api';

const authHeaderService = new AuthHeaderService(API_URL);

export const getAddress = () => {
  return authHeaderService.getHeaders()
    .then((headers) => axios.get(`${API_URL}/address/`, {
      headers
    }))
    .then((res) => {
      console.log('getAddress:', res);
    })
    .catch(error => {
      console.log(error);
    })
};
