import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { GoogleAnalyticsService } from '../../@core/services/google-analytics.service';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageService } from 'primeng/api';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-new-account',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule,CommonModule,HeaderComponent,ToastModule],
  providers:[MessageService],
  templateUrl: './new-account.component.html',
  styleUrl: './new-account.component.scss'
})
export class NewAccountComponent {
  private url= environment.apiBaseUrl;
  registerForm!: FormGroup;
  show=false

  constructor(
    private googleAnalyticsService: GoogleAnalyticsService,
    private fb: FormBuilder,
    private http: HttpClient,
    private route: Router,
    private messageService: MessageService
  ) {
    this.registerForm = fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      roles: [''],

    });
  }

  ngOnInit() {
    let roles= localStorage.getItem('roles')
    if(roles==='admin'){
this.show=true
    }
    this.route.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.googleAnalyticsService.sendPageView(event.urlAfterRedirects, event.urlAfterRedirects);
      });
  }

  sendForm() {
    if (this.registerForm.valid) {
      const loginData:any = {
        userName: this.registerForm.controls['username'].value,
        email: this.registerForm.controls['email'].value,
        password: this.registerForm.controls['password'].value,

      };
      const rolesVal =        this.registerForm.controls['roles'].value
      if(rolesVal&&rolesVal.trim()!==''){
        loginData.roles=rolesVal
      }

      console.log(this.registerForm.value)

      this.http.post(`${this.url}/users/sign-up`, loginData)
        .subscribe(response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User registered successfully!'
          });
          setTimeout(()=>{
            let roles= localStorage.getItem('roles')

            if(roles==='admin'){
              this.route.navigate(['users'])
            }else{
              this.route.navigate(['auth']);

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
