import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuotesComponent } from './quotes/quotes.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'quotes', component: QuotesComponent },
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },


];
