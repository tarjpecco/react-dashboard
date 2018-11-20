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

export const getAuthToken = ({ username, password }) => {
  return fetch(`${API_URL}/token/`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    throw response.statusText;
  }).then(res => {
    localStorage.setItem('id_token', res.access)
    return res;
  })
  .catch(err => {
    throw err;
  })
};

export const getCurrentUser = () => {
  return authHeaderService.getHeaders()
    .then((headers) => axios.get(`${API_URL}/users/me/`,
    {
      headers
    }))
    .then(res => res.data)
    .catch(error => {
      return error;
    })
};
