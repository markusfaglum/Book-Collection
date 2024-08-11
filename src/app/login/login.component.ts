import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AuthService } from '../Service/AuthService';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';

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

  isDarkMode = true;

  appComp = inject(AppComponent);

  // Dark/light mode
  ngOnInit(): void {
    this.initializeSwitchState(); 
  }

  initializeSwitchState(): void {
    
    this.isDarkMode = this.appComp.getIsDark('isDarkMode');
    if (this.isDarkMode === true) {
      this.appComp.darkTheme();
      console.log("It's dark");
    } else {
      this.appComp.lightTheme();
      console.log("It's light");
    }
    this.appComp.setIsDark(this.isDarkMode);

  }

  toggleTheme() {
    this.appComp.toggleTheme();
    this.isDarkMode = !this.isDarkMode;
  }

  constructor(private authService: AuthService, private router: Router) { }

  // Form + login
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
