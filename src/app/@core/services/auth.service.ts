import { Injectable } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment.production';
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
    const loginData = { identifier: email, password: password };
    return new Observable((observer) => {
      axios.post(`${this.apiUrl}/auth/local`, loginData)
        .then(response => {
          localStorage.setItem('jwt', response.data.jwt);
          localStorage.setItem('email', email);

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
    this.router.navigate(['/auth']);
  }
  private sendObj = new BehaviorSubject({});

  sendObject = this.sendObj.asObservable();
  sendObjectToForm(data: any) {
    this.sendObj.next(data);
  }
}
