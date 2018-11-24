import axios from 'axios';
import AuthHeaderService from './auth-header';

export const API_URL = process.env.REACT_APP_API_URL || 'https://flexcomply-dev.nanoapp.io/api';

const authHeaderService = new AuthHeaderService(API_URL);

export const getAddressById = (id) => {
  return authHeaderService.getHeaders()
    .then((headers) => axios.get(`${API_URL}/address/${id}`, {
      headers
    }))
    .then(res => res.data)
};

export const getUserLicensesForUser = (userPK) => {
  return authHeaderService.getHeaders()
    .then((headers) => axios.get(`${API_URL}/user-licenses/${userPK}/`, {
      headers
    }))
    .then(res => res.data)
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
};

export const removeUserLicenseForUser = (userPK, licenseId) => {
  return authHeaderService.getHeaders()
    .then((headers) => axios.delete(`${API_URL}/user-licenses/${userPK}/${licenseId}/`,
    {
      headers
    }))
};

export const getCurrentUser = () => {
  return authHeaderService.getHeaders()
    .then((headers) => axios.get(`${API_URL}/users/me/`,
    {
      headers
    }))
    .then(res => res.data)
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
};

export const getProjects = () => {
  return authHeaderService.getHeaders()
    .then((headers) => axios.get(`${API_URL}/projects/`,
    {
      headers
    }))
    .then(res => res.data)
};

export const createProject = (params) => {
  return authHeaderService.getHeaders()
    .then((headers) => axios.post(`${API_URL}/projects/`,
    {
      ...params,
    },
    {
      headers
    }))
    .then(res => res.data)
};

export const getJobsForProject = (id, status) => {
  return authHeaderService.getHeaders()
    .then((headers) => axios.get(`${API_URL}/jobs/?project_id=${id}&&status=${status}`,
    {
      headers
    }))
    .then(res => res.data)
};

export const createJob = (params) => {
  return authHeaderService.getHeaders('multipart/form-data')
    .then((headers) => {
    return axios.post(`${API_URL}/jobs/`,
    params,
    {
      headers,
    })})
    .then(res => {
      if (res.status < 400)
        return res.data;
      throw res.statusText;
    })
};

export const updateCurrentUser = (params) => {
  return authHeaderService.getHeaders()
    .then((headers) => axios.patch(`${API_URL}/users/me/`,
    {
      ...params,  
    },
    {
      headers
    }))
    .then(res => res.data)
};
