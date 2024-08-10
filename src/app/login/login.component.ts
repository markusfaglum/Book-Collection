import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AuthService } from '../Service/AuthService';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  http = inject(HttpClient);


  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })

  onFormSubmit() {

    const username = this.loginForm.get('username')?.value as string;
    const password = this.loginForm.get('password')?.value as string;

    const loginRequest = {
      username,
      password
    };

    this.authService.login(loginRequest.username, loginRequest.password).subscribe({
      next: (response) => {
        console.log('Login successful');
        this.router.navigate(['/home']);
      },
      error: (err) => {

        this.errorMessage = 'Login failed. Please check your credentials and try again.';
        console.error('Login failed', err);
      }
    });
  }
}
