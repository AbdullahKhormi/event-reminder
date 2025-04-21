import { Injectable } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwt');
    return !!token;
  }

  login(email: string, password: string): Observable<any> {
    const loginData = { email: email, password: password };
    return new Observable((observer) => {
      axios.post(`${this.apiUrl}/users/login`, loginData)
        .then((response: any) => {
          console.log(response.data.token)
          const token = response.data.token;
          localStorage.setItem('jwt', token);
          localStorage.setItem('email', email);

          // Decode the token and store userId
          const decodedToken: any = jwtDecode(token);
          const userId = decodedToken.userId;
          localStorage.setItem('userId', userId);

          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('roles');
    this.router.navigate(['/auth']);
  }

  private sendObj = new BehaviorSubject({});

  sendObject = this.sendObj.asObservable();
  sendObjectToForm(data: any) {
    this.sendObj.next(data);
  }
  getDecodedToken(): any {
    const token = localStorage.getItem('jwt');
    if (token) {
      try {

        return jwtDecode(token);

      } catch (error) {
        return null;
      }
    }
    return null;
  }
}
