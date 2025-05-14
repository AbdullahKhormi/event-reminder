import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

interface Pagination {
  first: number;
  rows: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  search:string
}

@Injectable({
  providedIn: 'root'
})
export class DataMongoService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private apiUrl = environment.apiBaseUrl;

 getAll(request: Pagination) {
  const { first, rows, sortField = 'eventDate', sortOrder = 'desc' ,search } = request;
  const userId = this.authService.getDecodedToken()?.userId;

 if(search){
   return this.http.get<any>(`${this.apiUrl}/event`, {
    params: {
      first: first.toString(),
      rows: rows.toString(),
      userId: userId?.toString(),
      sortField,
      sortOrder,
      search:search?.toString()
    }
  });
 }else{
   return this.http.get<any>(`${this.apiUrl}/event`, {
params: {
      first: first.toString(),
      rows: rows.toString(),
      userId: userId?.toString(),
      sortField,
      sortOrder,
    }
  });
 }
}

  getById(id: any) {
    const userId = this.authService.getDecodedToken()?.userId;
    return this.http.get<any>(`${this.apiUrl}/event/${id}`, {
      params: { userId: userId?.toString() }
    });
  }

  postEvent(data: any) {
    const userId = this.authService.getDecodedToken()?.userId;
    const eventData = { ...data, userId };
    return this.http.post<any>(`${this.apiUrl}/event`, eventData);
  }

  deleteEvent(id: any) {
    const userId = this.authService.getDecodedToken()?.userId;
    return this.http.delete<any>(`${this.apiUrl}/event/${id}`, {
      params: { userId: userId?.toString() }
    });
  }

  updateEvent(id: any, data: any) {
    const userId = this.authService.getDecodedToken()?.userId;
    const updatedData = { ...data, userId };
    return this.http.put<any>(`${this.apiUrl}/event/${id}`, updatedData);
  }

  getAllUsers(request: Pagination) {
    const { first, rows } = request;
    const userId = this.authService.getDecodedToken()?.userId;
    return this.http.get<any>(`${this.apiUrl}/users`, {
      params: {
        first: first.toString(),
        rows: rows.toString(),
        userId: userId?.toString()
      }
    });
  }
  getAllUsersWithoutPag() {

    return this.http.get<any>(`${this.apiUrl}/users`, {

    });
  }

  getUsersById(id: any) {
    const userId = this.authService.getDecodedToken()?.userId;
    return this.http.get<any>(`${this.apiUrl}/users/${id}`);
  }

  deleteUsers(id: any) {
    const userId = this.authService.getDecodedToken()?.userId;
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
  }

  updateUsers(id: any, data: any) {
    const userId = this.authService.getDecodedToken()?.userId;
    const updatedData = { ...data, userId };
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, updatedData);
  }

  verfiEmail(fPass:any){
    return this.http.post<any>(`${this.apiUrl}/users/forgot-password`, fPass);
  }
  verifyOtp(email: any, otp: string) {
    return this.http.post<any>(`${this.apiUrl}/users/verify-otp`, { email, otp });
  }
  private sendEmail = new BehaviorSubject('');

  receiveEm = this.sendEmail.asObservable();
  receive(data: any) {
    this.sendEmail.next(data);
  }
}