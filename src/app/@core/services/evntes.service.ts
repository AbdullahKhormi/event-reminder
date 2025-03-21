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

  getEventById1(eventId: number): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('Token is missing');
    }

    return new Observable((observer) => {
      axios.get(`${this.apiUrl}/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`  // إرسال الـ JWT في الهيدر
        }
      })
      .then(response => {
        console.log(response)
        observer.next(response.data); // إرسال البيانات المسترجعة
        observer.complete();
      })
      .catch(error => {
        observer.error(error); // في حال حدوث خطأ
      });
    });
  }

  getProtectedData(page: number, pageSize: number): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('Token is missing');
    }
    const userId = this.getUserId(); // استخراج الـ userId من الـ token

    return new Observable((observer) => {
      const start = (page - 1) * pageSize; // حساب الـ start بناءً على الصفحة

      axios.get(`${this.apiUrl}/events?pagination[start]=${start}&pagination[limit]=${pageSize}&sort=nameEvent:desc`, {
        headers: {
          Authorization: `Bearer ${token}`
        },params: {
          userId: userId // إضافة userId كـ parameter إذا لزم الأمر
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
    const userId = this.getUserId(); // استخراج الـ userId من الـ token

    return new Observable((observer) => {

      axios.get(`${this.apiUrl}/events?pobulate=*`, {
        headers: {
          Authorization: `Bearer ${token}`
        },params: {
          userId: userId // إضافة userId كـ parameter إذا لزم الأمر
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
          observer.next(response.data); // إرسال البيانات المسترجعة
          observer.complete();
        })
        .catch(error => {
          observer.error(error); // في حال حدوث خطأ
        });
    });
  }
  getUserId(): number | null {
    const decodedToken = this.getDecodedToken();
    console.log(decodedToken)
     // استخدم الدالة السابقة لفك تشفير التوكن
    return decodedToken ? decodedToken.id : null;  // إذا كان التوكن يحتوي على id في الـ payload، قم بإرجاعه
  }
}
