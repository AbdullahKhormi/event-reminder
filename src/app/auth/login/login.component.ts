import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../@core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EvntesService } from '../../@core/services/evntes.service';
import { GoogleAnalyticsService } from '../../@core/services/google-analytics.service';
import { environment } from '../../../environments/environment.production';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule,RouterModule,CommonModule,ToastModule],
  providers:[MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private url =environment.apiBaseUrl
  isShow=false
  receiveObj:any
    @Input() imgLogo ='../../../assets/common/logo.jpeg'
  loginForm!:FormGroup
constructor(private fb :FormBuilder,private http :HttpClient ,
  private googleAnalyticsService: GoogleAnalyticsService, private route :Router,private authService:AuthService,private evS:EvntesService,private messageService:MessageService){
this.loginForm=fb.group({
  email: ['', [Validators.required, Validators.email]],
   password:['',Validators.required]
})

}
getUsers(): Observable<any> {
  return this.http.get(`${this.url}/users`);
}
ngOnInit(){

  this.authService.sendObject.subscribe(res=>{
    this.receiveObj=res
  })
  this.getDecodedToken()
  this.route.events
  .pipe(
    filter((event) => event instanceof NavigationEnd)
  )
  .subscribe((event: any) => {
    // Access urlAfterRedirects from NavigationEnd event
    this.googleAnalyticsService.sendPageView(event.urlAfterRedirects, event.urlAfterRedirects);
  });

}
getDecodedToken() {
  const token = localStorage.getItem('jwt');
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } catch (error) {
    }
  }
  return null;
}

sendForm() {  if (this.loginForm.valid) {
  const loginData = {
    email: this.loginForm.controls['email'].value,
    password: this.loginForm.controls['password'].value,
  };

  this.authService.login(loginData.email, loginData.password).subscribe(
    (response: any) => {

      localStorage.setItem('jwt', response.token);
      if (response.user) {
        localStorage.setItem('username', response.user.userName);
        localStorage.setItem('userId', response.user.userId);
        localStorage.setItem('roles', response.user.roles);
      }

      const decodedToken = this.getDecodedToken();

      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Login Successfully`,
        });
      }, 1000);

      setTimeout(() => {
        const users = localStorage.getItem('roles')
        if(users==='admin'){
          this.route.navigate(['users']);
        }else{
          this.route.navigate(['home']);

        }
      }, 3000);
    },
    (error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Invalid email or password`,
      });
    }
  );

}

  // setTimeout(() => {
  //   this.route.navigate(['home']);
  // }, 3000);
}

}
