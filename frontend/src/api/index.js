import axios from 'axios';
import AuthHeaderService from './auth-header';

export const API_URL = process.env.REACT_APP_API_URL || 'https://flexcomply-dev.nanoapp.io/api';

const authHeaderService = new AuthHeaderService(API_URL);

export const getAddress = () => {
  return authHeaderService.getHeaders()
    .then((headers) => axios.get(`${API_URL}/address/`, {
      headers
    }))
    .catch(error => {
      return error;
    })
};

export const getUserLicensesForUser = (userPK) => {
  return authHeaderService.getHeaders()
    .then((headers) => axios.get(`${API_URL}/user-licenses/${userPK}/`, {
      headers
    }))
    .then(res => res.data)
    .catch(error => {
      return error;
    })
};

export const createUserLicenseForUser = (userPK, params) => {
  return authHeaderService.getHeaders()
    .then((headers) => axios.post(`${API_URL}/user-licenses/${userPK}/`,
    {
      ...params,
    },
    {
      headers
    }))
    .then(res => res.data)
    .catch(error => {
      return error;
    })
};

export const updateUserLicenseForUser = (userPK, licenseId, params) => {
  return authHeaderService.getHeaders()
    .then((headers) => axios.put(`${API_URL}/user-licenses/${userPK}/${licenseId}/`,
    {
      ...params,
    },
    {
      headers
    }))
    .then(res => res.data)
    .catch(error => {
      return error;
    })
};

export const removeUserLicenseForUser = (userPK, licenseId) => {
  return authHeaderService.getHeaders()
    .then((headers) => axios.delete(`${API_URL}/user-licenses/${userPK}/${licenseId}/`,
    {
      headers
    }))
    .catch(error => {
      return error;
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

export const getProjects = () => {
  return authHeaderService.getHeaders()
    .then((headers) => axios.get(`${API_URL}/projects/`,
    {
      headers
    }))
    .then(res => res.data)
    .catch(error => {
      return error;
    })
};

export const createProject = (params) => {
  console.log('here api params:', params);
  return authHeaderService.getHeaders()
    .then((headers) => axios.post(`${API_URL}/projects/`,
    {
      ...params,
    },
    {
      headers
    }))
    .then(res => res.data)
    .catch(error => {
      return error;
    })
};