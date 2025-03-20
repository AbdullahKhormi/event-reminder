import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { EvntesService } from '../../@core/services/evntes.service';
import { DatePipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpClient } from '@angular/common/http';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
@Component({
  selector: 'app-all-event',
  standalone: true,
  imports: [TableModule, DatePipe, PaginatorModule,ToastModule],
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

  constructor(private getData: EvntesService,private messageService:MessageService,private http :HttpClient) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    const page = Math.floor(this.first / this.rows) + 1;
    this.getData.getAllEvents(page, this.rows).subscribe((res) => {
      this.events = res.data;
      this.totalRecords = res.meta.pagination.total;
    });
  }

  paginate(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadEvents();
  }
  delete(event:Event){
    this.http.delete<any>(`${this.url}/${event}`).subscribe(
      (data) => {


           }

          , (error) => {
            if(error.error.error.status==500){
              setTimeout(() => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: `Event Deleted Successfully`,
                });  }, 2200);
              setTimeout(() => {
                this.loadEvents()

                 }, 3200);
            }
          })

  }
  send(){
    emailjs.init('AG9bmRQp2QgOY-_Cd')
    emailjs.send("service_mmfdc5h","template_5t4yvq4",{
      email:'akhormi.1@outlook.com',
      message:'test',title:'Ak'
    });

  }

}
