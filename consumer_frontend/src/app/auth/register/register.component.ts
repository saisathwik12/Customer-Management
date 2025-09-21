import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import axios from 'axios';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';
    const { email, password } = this.registerForm.value;

    try {
      // call the AuthService register method
      const res = await this.authService.register(email, password);

      // optional: store token if backend returns it
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
      }

      alert('Registration successful!');
      this.router.navigate(['/login']); // redirect to login
    } catch (err: any) {
      console.error(err);
      this.errorMsg =
        err.response?.data?.message || 'Registration failed. Try again.';
    } finally {
      this.loading = false;
    }
  }

  ngOnInit(): void {
  }

}
