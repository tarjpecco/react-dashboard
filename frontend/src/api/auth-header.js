import decode from 'jwt-decode';

import { history } from '../redux/store';

export default class AuthHeaderService {
  constructor(domain) {
    this.domain = domain;
  }

  isTokenValid = () => {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired = (token) => {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  setToken = (idToken) => {
    localStorage.setItem('id_token', idToken);
  }

  getToken = () => {
    return localStorage.getItem('id_token');
  }

  getHeaders = () => {
    let username = localStorage.getItem('username');
    if (!username) username = 'gc';
    let password = localStorage.getItem('password');
    if (!password) password = 'flexcomply12';

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.isTokenValid()) {
      headers.Authorization = `Bearer ${this.getToken()}`;
      return new Promise((resolve) => resolve(headers));
    }
    localStorage.removeItem('user');
    localStorage.removeItem('id_token');
    history.push('/login');
    const error = 'token expired';
    return new Promise((resolve) => resolve(new Error(error)));
  }
}
