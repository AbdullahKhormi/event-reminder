import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import axios from 'axios';
import { environment } from '../../../environments/environment.production';
interface CustomJwtPayload {
  id: number;
}
@Injectable({
  providedIn: 'root'
})

export class EvntesService {

  constructor(private http: HttpClient) {}
  private apiUrl = environment.apiBaseUrl;

  getEventById1(eventId: number): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('Token is missing');
    }

    return new Observable((observer) => {
      axios.get(`${this.apiUrl}/events/${eventId}`, {
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

  getProtectedData(page: number, pageSize: number): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('Token is missing');
    }

    const userId = this.getUserId();

    return new Observable((observer) => {
      const start = (page - 1) * pageSize;

      axios.get(`${this.apiUrl}/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          "pagination[start]": start,
          "pagination[limit]": pageSize,
          "sort": "nameEvent:desc",
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

  getData(){
    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('Token is missing');
    }
    const userId = this.getUserId();

    return new Observable((observer) => {

      axios.get(`${this.apiUrl}/events?pobulate=*`, {
        headers: {
          Authorization: `Bearer ${token}`
        },params: {
          userId: userId
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
  deleteData(eventId: number): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('Token is missing');
    }

    return new Observable((observer) => {
      axios.delete(`${this.apiUrl}/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
  getEventById(eventId: number): Observable<any> {
    return new Observable((observer) => {
      axios.get(`${this.apiUrl}/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
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
  getUserId(): number | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.id : null;
  }
  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        return decodedToken.id;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  getEvents() {
    const userId = this.getUserIdFromToken();
    if (userId) {
      return this.http.get(`${this.apiUrl}/events?userId=${userId}`);
    }
    return this.http.get(`${this.apiUrl}/events`);
  }
}
