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
import { DataMongoService } from '../../@core/services/data-mongo.service';
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
  constructor(private getData: EvntesService,private messageService:MessageService,private http :HttpClient,private router: Router,
     private googleAnalyticsService: GoogleAnalyticsService , private mongoD:DataMongoService) {

}
getAll() {
  this.mongoD.getAll().subscribe(res => {
    this.events = res; // نعيّن البيانات مباشرة هنا
    this.events.forEach(ev => {
      ev.isExpiredDate = ev.eventDate < this.curentDate;
    });

    this.loading = false;

    // لو تبي تعرض رسالة لما القائمة تكون فاضية
    if (this.events.length === 0) {
    }
  });
}

  ngOnInit() {
this.getAll()


  }
  ev: any

  loadEvents() { //strapi
// //     this.loading = true;
// //     const page = Math.floor(this.first / this.rows) + 1;
// //     this.getData.getProtectedData(page, this.rows).subscribe((res) => {
// //       this.events = res.data.results;
// //       for(let i = 0 ; i<this.events.length
// //         ; i++
// //       ){
// //        this. ev=this.events[i]
// // if(this.ev.dateEvent<this.curentDate){
// // this.ev.isExpiredDate=true
// // this.loading = false;
// // }
// //       }

//       this.loading=false

//       this.totalRecords = res.data.pagination.total;

//     });

  }

  paginate(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadEvents();
  }

  deleteEvent(eventId: number): void { //strapi
    // this.getData.deleteData(eventId).subscribe(
    //   (response) => {
    //   },
    //   (error) => {
    //     if ( error.response.status === 500) {
    //       setTimeout(() => {
    //         this.messageService.add({
    //           severity: 'success',
    //           summary: 'Success',
    //           detail: `Event Deleted Successfully`,
    //         });
    //       }, 2200);

    //       setTimeout(() => {
    //         this.loadEvents();
    //       }, 3200);
    //     }
    //   }
    // );
  }
  isDeleting: { [id: string]: boolean } = {}; // حالة الحذف لكل event

  delete(id: string) {
    if (this.isDeleting[id]) return;
    this.isDeleting[id] = true;

    this.mongoD.deleteEvent(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Event Deleted Successfully`,
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Event Deletion Failed`,
        });
        this.isDeleting[id] = false;
      },
      complete: () => {
        setTimeout(() => {
          this.getAll();
          this.isDeleting[id] = false;
        }, 1500);
      }
    });
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
