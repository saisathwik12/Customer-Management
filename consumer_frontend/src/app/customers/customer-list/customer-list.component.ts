import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  customers: any[] = [];
  

  constructor(private service: CustomerService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.loadCustomers();
  }

  async loadCustomers() {
    try {
      const res = await this.service.getCustomers();
      this.customers = res.data;
    } catch (err: any) {
      this.toastr.error(err.response?.data?.message || 'Failed to load customers');
    }
  }

  editCustomer(id: string) {
    this.router.navigate([`/customers/edit/${id}`]);
  }

  async deleteCustomer(id: string) {
    if (!confirm('Are you sure to delete?')) return;
    try {
      await this.service.deleteCustomer(id);
      this.toastr.success('Customer deleted');
      this.loadCustomers();
    } catch (err: any) {
      this.toastr.error(err.response?.data?.message || 'Delete failed');
    }
  }

}
