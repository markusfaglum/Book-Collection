import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7204/api/Auth';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (response.token) {
          console.log("we are here", response.token);
          this.saveToken(response.token);
        }
      })
    );
  }

  private saveToken(token: string): void {
    const expires = new Date();
    console.log("save token", token);
    expires.setHours(expires.getHours() + 1);
    this.cookieService.set('jwt', token, expires, '/', '', true, 'Strict');
  }

  getToken(): string | null {
    console.log("get token", this.cookieService.get('jwt'));
    return this.cookieService.get('jwt');
  }

  logout(): void {
    this.cookieService.delete('jwt', '/');
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, password });
  }

}
