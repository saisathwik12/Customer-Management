import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from '../address.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {
  addresses: any[] = [];
  customerId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AddressService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.customerId = this.route.snapshot.params['customerId'];
    this.loadAddresses();
    console.log(this.customerId)
  }

  async loadAddresses() {
    try {
      const res = await this.service.getAddresses(this.customerId);
      this.addresses = res.data;
    } catch (err: any) {
      this.toastr.error(err.response?.data?.message || 'Failed to load addresses');
    }
  }

  editAddress(addressId: string) {
    this.router.navigate([`/customers/${this.customerId}/addresses/edit/${addressId}`]);
  }

  async deleteAddress(addressId: string) {
    if (!confirm('Are you sure?')) return;
    try {
      await this.service.deleteAddress(this.customerId, addressId);
      this.toastr.success('Address deleted');
      this.loadAddresses();
    } catch (err: any) {
      this.toastr.error(err.response?.data?.message || 'Delete failed');
    }
  }

}
