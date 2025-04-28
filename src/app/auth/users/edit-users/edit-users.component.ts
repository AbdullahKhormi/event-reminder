import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../../environments/environment';
import { GoogleAnalyticsService } from '../../../@core/services/google-analytics.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DataMongoService } from '../../../@core/services/data-mongo.service';

@Component({
  selector: 'app-edit-users',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule,CommonModule,HeaderComponent,ToastModule],
  providers:[MessageService],  templateUrl: './edit-users.component.html',
  styleUrl: './edit-users.component.scss'
})
export class EditUsersComponent {
    private url= environment.apiBaseUrl;
    updateForm!: FormGroup;
    show=false
    userId!: string;
    users: any = {};

    constructor(
      private googleAnalyticsService: GoogleAnalyticsService,
      private fb: FormBuilder,
      private http: HttpClient,
      private router: Router,    private route: ActivatedRoute,
private mongo :DataMongoService,
      private messageService: MessageService
    ) {
      this.updateForm = fb.group({
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        roles: [''],

      });
    }
    ngOnInit() {
      this.userId = this.route.snapshot.paramMap.get('id')!;
      if (this.userId) {
        this.loadEventData();
      } else {
        console.error('No paramId found');
      }
        let roles= localStorage.getItem('roles')
        if(roles==='admin'){
    this.show=true
        }
        this.router.events
          .pipe(filter((event) => event instanceof NavigationEnd))
          .subscribe((event: any) => {
            this.googleAnalyticsService.sendPageView(event.urlAfterRedirects, event.urlAfterRedirects);
          });
      }
      loadEventData(): void {
        this.mongo.getUsersById(this.userId).subscribe(
          (res) => {

            if (res) {

              const selectedItem = res;

              if (selectedItem) {
                this.users = selectedItem;


                this.updateForm.patchValue({
                  username:this.users.userName,
        email:this.users.email,
        roles:this.users.roles
                });
              }
            }
          },
          (error) => {
            console.error('Error loading event data:', error);
          }
        );
      }
    sendForm() {
      if (this.updateForm.valid) {
        const loginData:any = {
          userName: this.updateForm.controls['username'].value,
          email: this.updateForm.controls['email'].value,

        };
        const rolesVal =        this.updateForm.controls['roles'].value
        if(rolesVal&&rolesVal.trim()!==''){
          loginData.roles=rolesVal
        }


        this.mongo.updateUsers(this.userId,loginData)
          .subscribe(response => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User updated successfully!'
            });
            setTimeout(()=>{
              let roles= localStorage.getItem('roles')

              if(roles==='admin'){
                this.router.navigate(['users'])
              }
             },2000)

          }, (error) => {
            let errorMessage = error.error.message || 'Something went wrong. Please try again later.';
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: errorMessage,
            });
          });
      }
    }
}
