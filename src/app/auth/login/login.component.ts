import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../@core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EvntesService } from '../../@core/services/evntes.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule,RouterModule,CommonModule,ToastModule],
  providers:[MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isShow=false
  receiveObj:any
    @Input() imgLogo ='../../../assets/common/logo.jpeg'
  loginForm!:FormGroup
constructor(private fb :FormBuilder,private http :HttpClient , private route :Router,private authService:AuthService,private evS:EvntesService,private messageService:MessageService){
this.loginForm=fb.group({
  email: ['', [Validators.required, Validators.email]],
   password:['',Validators.required]
})
}
getUsers(): Observable<any> {
  return this.http.get(`http://localhost:1337/users`);
}
ngOnInit(){

  this.authService.sendObject.subscribe(res=>{
    this.receiveObj=res
  })
  this.getDecodedToken()
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

sendForm() {
  if (this.loginForm.valid) {
    const loginData = {
      identifier: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value,
    };

    this.authService.login(loginData.identifier, loginData.password).subscribe(
      (response: any) => {
        localStorage.setItem('jwt', response.jwt);

        // this.evS.getProtectedData().subscribe(
        //   (data) => {
        //   },
        //   (error) => {
        //   }
        // );

        const decodedToken = this.evS.getDecodedToken();

        setTimeout(()=>{
          this.messageService.add({
            severity: 'success',
                  summary: 'Success',
                  detail: `Login Successfully`,
          });
        },1000);
        setTimeout(()=>{
          this.route.navigate(['home']);
        },3000);
      },
      (error) => {

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Invalid email or password`,
          });  },
    );
  }
}
}
