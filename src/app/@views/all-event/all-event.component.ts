import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { EvntesService } from '../../@core/services/evntes.service';
import { CommonModule, DatePipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpClient } from '@angular/common/http';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { GoogleAnalyticsService } from '../../@core/services/google-analytics.service';
import { filter } from 'rxjs';
@Component({
  selector: 'app-all-event',
  standalone: true,
  imports: [TableModule, DatePipe, PaginatorModule,ToastModule,RouterModule,CommonModule],
  providers: [DatePipe,MessageService],
  templateUrl: './all-event.component.html',
  styleUrls: ['./all-event.component.scss']
})
export class AllEventComponent implements OnInit {
  events: any[] = [];
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;
  loading: boolean = true;
  curentDate = new Date().toISOString()
  isExpiredDate=false
  constructor(private getData: EvntesService,private messageService:MessageService,private http :HttpClient,private router: Router, private googleAnalyticsService: GoogleAnalyticsService) {

}

  ngOnInit() {
    console.log(this.curentDate)
    this.loadEvents();
    this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd)
    )
    .subscribe((event: any) => {
      // Access urlAfterRedirects from NavigationEnd event
      this.googleAnalyticsService.sendPageView(event.urlAfterRedirects, event.urlAfterRedirects);
    });

  }
  ev: any

  loadEvents() {
    this.loading = true;
    const page = Math.floor(this.first / this.rows) + 1;
    this.getData.getProtectedData(page, this.rows).subscribe((res) => {
      this.events = res.data;
      for(let i = 0 ; i<this.events.length
        ; i++
      ){
       this. ev=this.events[i]
if(this.ev.dateEvent<this.curentDate){
this.ev.isExpiredDate=true

}
      }

      this.totalRecords = res.meta.pagination.total;
      this.loading = false;
    });
  }

  paginate(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadEvents();
  }

  deleteEvent(eventId: number): void {
    this.getData.deleteData(eventId).subscribe(
      (response) => {
      },
      (error) => {
        if ( error.response.status === 500) {
          setTimeout(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Event Deleted Successfully`,
            });
          }, 2200);

          setTimeout(() => {
            this.loadEvents();
          }, 3200);
        }
      }
    );
  }

  send(event: any) {
    const email = localStorage.getItem('email');
    const eventDate = new Date(event.dateEvent);
    const formattedDate = eventDate.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const messageContent = `
      There is not much left for your event
           - Event Name -: ${event.nameEvent} - Event Date -: ${formattedDate}`;

    emailjs.init('AG9bmRQp2QgOY-_Cd');

    // إرسال الإيميل أول مرة
    this.sendEmail(messageContent, event.nameEvent);

    // إرسال الإيميل كل دقيقة
    setInterval(() => {
      this.sendEmail(messageContent, event.nameEvent);
    }, 30000); // 60000 مللي ثانية تعني دقيقة واحدة
  }

  sendEmail(messageContent: string, eventName: string) {
    emailjs.send('service_mmfdc5h', 'template_5t4yvq4', {
      email: 'akhormi.1@outlook.com',
      message: messageContent,
      title: eventName,
    })
    .then((response) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Event email sent successfully',
      });
    })
    .catch((error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to send email',
      });
    });
  }


}
