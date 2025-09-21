import { Injectable } from '@angular/core';
import axios from 'axios';

const API = 'http://localhost:4000/api/customers';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
}

@Injectable({ providedIn: 'root' })
export class AddressService {

  async getAddresses(customerId: string) {
    const res = await axios.get(`${API}/${customerId}/addresses`, { headers: getAuthHeaders() });
    return res.data;
  }

  async createAddress(customerId: string, data: any) {
    const res = await axios.post(`${API}/${customerId}/addresses`, data, { headers: getAuthHeaders() });
    return res.data;
  }

  async updateAddress(customerId: string, addressId: string, data: any) {
    const res = await axios.put(`${API}/${customerId}/addresses/${addressId}`, data, { headers: getAuthHeaders() });
    return res.data;
  }

  async deleteAddress(customerId: string, addressId: string) {
    const res = await axios.delete(`${API}/${customerId}/addresses/${addressId}`, { headers: getAuthHeaders() });
    return res.data;
  }
}
