import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvntesService {

  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:1337/api';
getAllEvents() : Observable<any>{
  return this.http.get<any>(`${this.apiUrl}/events`);
}
postEvents(data: any) : Observable<any>{
  return this.http.post<any>(`${this.apiUrl}/events`,data);
}
}
