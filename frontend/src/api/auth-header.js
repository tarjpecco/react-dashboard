import decode from 'jwt-decode';

export default class AuthHeaderService {
  constructor(domain) {
    this.domain = domain;
  }

  getAuthToken = ({ username, password }) => {
    return fetch(`${this.domain}/token/`, {
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
      return response.json();
    }).then(res => {
      this.setToken(res.access)
      return res;
    })
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
    return this.getAuthToken({ username: 'testdev', password: 'password' }).
      then((res) => {
        headers.Authorization = `Bearer ${res.access}`;
        return headers;
      });
  }
}
