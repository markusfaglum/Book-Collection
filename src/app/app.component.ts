import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BookCollection.web';

  private cookieService = inject(CookieService);

  // Dark/light mode logic
  isDarkMode = true;

  
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.cookieService.set('isDarkMode', this.isDarkMode.toString(), 365);
    this.applyTheme();
  }
  
  applyTheme(): void {
    if (this.isDarkMode) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  getIsDark(isDarkString: string): boolean {
    const value = this.cookieService.get('isDarkMode');
    return value === 'true'; 
  }

  darkTheme() {
    document.documentElement.removeAttribute('data-theme');
  }

  lightTheme() {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  setIsDark(isDark: boolean): void {
    this.isDarkMode = isDark; 
  }
}
