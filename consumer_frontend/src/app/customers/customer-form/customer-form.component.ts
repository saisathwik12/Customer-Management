import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  customer: any = {
    name: '',
    phone: '',
  };
  editMode = false;
  id: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CustomerService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.editMode = true;
      this.loadCustomer();
    }
  }

  async loadCustomer() {
    try {
      const res = await this.service.getCustomer(this.id);
      this.customer = res.data;
    } catch (err: any) {
      this.toastr.error(err.response?.data?.message || 'Failed to load customer');
    }
  }

  async save() {
    try {
      if (this.editMode) {
        await this.service.updateCustomer(this.id, this.customer);
        this.toastr.success('Customer updated');
      } else {
        await this.service.createCustomer(this.customer);
        this.toastr.success('Customer created');
      }
      this.router.navigate(['/customers']);
    } catch (err: any) {
      this.toastr.error(err.response?.data?.message || 'Save failed');
    }
  }

}
