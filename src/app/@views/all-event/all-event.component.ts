import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { EvntesService } from '../../@core/services/evntes.service';
import { CommonModule, DatePipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpClient } from '@angular/common/http';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-all-event',
  standalone: true,
<<<<<<< HEAD
  imports: [TableModule, DatePipe, PaginatorModule,ToastModule,RouterModule,CommonModule],
=======
  imports: [TableModule, DatePipe, PaginatorModule,ToastModule,RouterModule],
>>>>>>> 3ea2147841b91a5693542190d00aad685aab3ae2
  providers: [DatePipe,MessageService],
  templateUrl: './all-event.component.html',
  styleUrls: ['./all-event.component.scss']
})
export class AllEventComponent implements OnInit {
  events: any[] = [];
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;
  private url = 'http://localhost:1337/api/events';
  loading: boolean = true;

  constructor(private getData: EvntesService,private messageService:MessageService,private http :HttpClient) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    const page = Math.floor(this.first / this.rows) + 1;
    this.getData.getProtectedData(page, this.rows).subscribe((res) => {
      this.events = res.data;
      this.totalRecords = res.meta.pagination.total;
      this.loading = false;
    });
  }

  paginate(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadEvents();
  }
  delete(postId:any){
    this.http.delete<any>(`${this.url}/${postId}`).subscribe(
      (data) => {
        alert("data")


           }

          , (error) => {
            if(error.error.error.status==500){
            // this.getData()
            }
          })
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

  send(event:any){


const eventDate = new Date(event.dateEvent);
  const formattedDate = eventDate.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const messageContent = `
  There is not much left for your event
       - Event Name -: ${event.nameEvent} - Event Date -: ${formattedDate}`
    emailjs.init('AG9bmRQp2QgOY-_Cd')
    emailjs.send("service_mmfdc5h","template_5t4yvq4",{
      email:'akhormi.1@outlook.com',
    message: messageContent,
      title:event.nameEvent
    });

  }

}
