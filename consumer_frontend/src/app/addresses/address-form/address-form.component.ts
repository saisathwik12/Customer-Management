import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from '../address.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {
  address: any = { label: '', address: '', city: '', state: '', pin_code: '' };
  customerId: string = '';
  editMode = false;
  addressId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AddressService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.customerId = this.route.snapshot.params['customerId'];
    this.addressId = this.route.snapshot.params['addressId'];
    if (this.addressId) {
      this.editMode = true;
      this.loadAddress();
    }
  }

  async loadAddress() {
    const res: any = await this.service.getAddresses(this.customerId);
    this.address = res.data.find((a: any) => a.id === this.addressId);
  }

  async save() {
    try {
      if (this.editMode) {
        await this.service.updateAddress(this.customerId, this.addressId, this.address);
        this.toastr.success('Address updated');
      } else {
        await this.service.createAddress(this.customerId, this.address);
        this.toastr.success('Address added');
      }
      this.router.navigate([`/customers/${this.customerId}/addresses`]);
    } catch (err: any) {
      this.toastr.error(err.response?.data?.message || 'Save failed');
    }
  }

}
