import { Injectable } from '@angular/core';
import axios from 'axios';

const API = 'https://customer-management-zfbr.onrender.com/api/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  tokenKey = 'token';

  async login(email: string, password: string) {
    const res = await axios.post(`${API}/login`, { email, password });
    localStorage.setItem(this.tokenKey, res.data.token);
    return res.data;
  }

  async register(email: string, password: string) {
    return await axios.post(`${API}/register`, { email, password });
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}
