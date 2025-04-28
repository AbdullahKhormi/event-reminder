import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { GoogleAnalyticsService } from '../../@core/services/google-analytics.service';
import { DataMongoService } from '../../@core/services/data-mongo.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [TableModule, PaginatorModule,ToastModule,RouterModule,CommonModule],
  providers: [DatePipe,MessageService],
    templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  constructor( private messageService:MessageService,private http :HttpClient,private router: Router,
       private googleAnalyticsService: GoogleAnalyticsService , private mongoD:DataMongoService) {

  }
  users: any[] = [];
  isDeleting: { [id: string]: boolean } = {};

  totalRecords: number = 0;
  rows = 10;
  first = 0;

  request: any = {
    first: 0,
    rows: 10,
    sortDirection: 1,
    sortColumn: ''

  };
  loading: boolean = true;
  ngOnInit() {
    this.getAll()
  }
  getAll() {
    this.loading = true;

    this.mongoD.getAllUsers(this.request).subscribe(res => {

      this.users = res.users;
      this.totalRecords = res.totalRecords;

      this.first = this.request.first;



      this.loading = false;
    });
  }
  onPageChange(user: any) {
    if (user.first !== this.request.first || user.rows !== this.request.rows) {
      this.request.first = user.first;
      this.request.rows = user.rows;

      this.first = user.first;

      this.getAll();
    }
  }

  delete(id: string) {
    if (this.isDeleting[id]) return;
    this.isDeleting[id] = true;


    this.mongoD.deleteUsers(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User Deleted Successfully`,
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `User Deletion Failed`,
        });
        this.isDeleting[id] = false;
      },
      complete: () => {
        setTimeout(() => {
          this.isDeleting[id] = false;

          this.getAll()
        }, 1500);
      }
    });
  }






}
