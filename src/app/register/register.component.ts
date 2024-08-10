import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AuthService } from '../Service/AuthService';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  http = inject(HttpClient);


  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(10)]),
    password: new FormControl('', [Validators.required, Validators.minLength(10)])
  })

  onFormSubmit() {

    if (this.registerForm.invalid) {
      this.errorMessage = 'Username and password must each be min. 10 characters long.';
      return;
    }

    const username = this.registerForm.get('username')?.value as string;
    const password = this.registerForm.get('password')?.value as string;

    const registerRequest = {
      username,
      password
    };


    this.authService.register(registerRequest.username, registerRequest.password).subscribe({
      next: () => {

        console.log('Registration successful');
        this.router.navigate(['/']);
      },
      error: (err) => {

        this.errorMessage = 'Registeration failed. Please check your credentials and try again.';
        console.error('Registeration failed', err);
      }
    });
  }
}
