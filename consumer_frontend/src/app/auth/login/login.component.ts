import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private auth: AuthService
  ) { }

  async login() {
    this.loading = true;
    try {
      const res = await this.auth.login(this.email, this.password);
      console.log(res.token)

      // 🔑 Check that res.data exists and has token
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        this.toastr.success('Login successful');
        this.router.navigate(['/customers']);
      } else {
        this.toastr.error('No token returned from server');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed';
      this.toastr.error(msg);
    } finally {
      this.loading = false;
    }
  }

}
