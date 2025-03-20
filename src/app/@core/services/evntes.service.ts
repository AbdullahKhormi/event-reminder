import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class EvntesService {

  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:1337/api';
  getAllEvents(page: number, pageSize: number): Observable<any> {
    const start = (page - 1) * pageSize; // حساب الـ start بناءً على الصفحة
    return this.http.get<any>(`${this.apiUrl}/events?pagination[start]=${start}&pagination[limit]=${pageSize}`);
  }

postEvents(data: any) : Observable<any>{
  return this.http.post<any>(`${this.apiUrl}/events`,data);
}
deletevents(id: any) : Observable<any>{
  return this.http.delete<any>(`${this.apiUrl}/events/${id}`,);
}



  getProtectedData(): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('Token is missing');
    }
    return new Observable((observer) => {
      axios.get(`${this.apiUrl}/events?populate=*`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
  postData(data: any): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('Token is missing');
    }

    return new Observable((observer) => {
      axios.post(`${this.apiUrl}/events`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  updateData(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('Token is missing');
    }

    return new Observable((observer) => {
      axios.put(`${this.apiUrl}/events/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
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
