import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';
  error = '';
  success = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.success = '';
    this.loading = true;
    this.authService.signup({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = res.message;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Try again.';
      }
    });
  }
}
