import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
}
