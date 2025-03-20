import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'http://localhost:1337/api/events/send-email'; // مسار API الخاص بـ Strapi

  constructor(private http: HttpClient) {}

  // دالة لإرسال البريد الإلكتروني
  sendEmail(email: string, subject: string, message: string): Observable<any> {
    const payload = {
      email,
      subject,
      message,
    };

    return this.http.post<any>(this.apiUrl, payload);
  }
}
