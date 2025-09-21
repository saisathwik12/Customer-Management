import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router, private toastr: ToastrService) {}

  logout() {
    this.authService.logout();
    this.toastr.success('Logged out successfully');
    this.router.navigate(['/login']);
  }
}
