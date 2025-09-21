import { Injectable } from '@angular/core';
import axios from 'axios';

const API = 'http://localhost:4000/api/customers';

@Injectable({ providedIn: 'root' })
export class CustomerService {

  getAuthHeaders() {
    const token = localStorage.getItem('token'); // Make sure you store JWT after login
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  async getCustomers(page = 1, limit = 10, filters = {}) {
    const params: any = { page, limit, ...filters };
    const res = await axios.get(API, { ...this.getAuthHeaders(), params });
    return res.data;
  }

  async getCustomer(id: string) {
    const res = await axios.get(`${API}/${id}`, this.getAuthHeaders());
    return res.data;
  }

  async createCustomer(data: any) {
    const res = await axios.post(API, data, this.getAuthHeaders());
    return res.data;
  }

  async updateCustomer(id: string, data: any) {
    const res = await axios.put(`${API}/${id}`, data, this.getAuthHeaders());
    return res.data;
  }

  async deleteCustomer(id: string) {
    const res = await axios.delete(`${API}/${id}`, this.getAuthHeaders());
    return res.data;
  }
}
