import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { AddressListComponent } from './addresses/address-list/address-list.component';
import { AddressFormComponent } from './addresses/address-form/address-form.component';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { CustomerFormComponent } from './customers/customer-form/customer-form.component';
import { RegisterComponent } from './auth/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'customers', component: CustomerListComponent, canActivate: [AuthGuard] },
  { path: 'customers/add', component: CustomerFormComponent, canActivate: [AuthGuard] },
  { path: 'customers/edit/:id', component: CustomerFormComponent, canActivate: [AuthGuard] },
  { path: 'customers/:customerId/addresses', component: AddressListComponent, canActivate: [AuthGuard] },
  { path: 'customers/:customerId/addresses/add', component: AddressFormComponent, canActivate: [AuthGuard] },
  { path: 'customers/:customerId/addresses/edit/:addressId', component: AddressFormComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule { }
