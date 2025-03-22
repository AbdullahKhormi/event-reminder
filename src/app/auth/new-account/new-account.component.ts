import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { GoogleAnalyticsService } from '../../@core/services/google-analytics.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-new-account',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule,CommonModule],
  templateUrl: './new-account.component.html',
  styleUrl: './new-account.component.scss'
})
export class NewAccountComponent {
  registerForm!:FormGroup
  constructor( private googleAnalyticsService: GoogleAnalyticsService,private fb :FormBuilder,private http :HttpClient , private route :Router){
  this.registerForm=fb.group({
    username:['',Validators.required],
    email: ['', [Validators.required, Validators.email]],
     password:['',Validators.required]
  })


  }
  ngOnInit(){
    this.route.events
    .pipe(
      filter((event) => event instanceof NavigationEnd)
    )
    .subscribe((event: any) => {
      // Access urlAfterRedirects from NavigationEnd event
      this.googleAnalyticsService.sendPageView(event.urlAfterRedirects, event.urlAfterRedirects);
    });
}

  sendForm(){

    if(this.registerForm.valid){
      const loginData = {
        username: this.registerForm.controls['username'].value,
        email: this.registerForm.controls['email'].value,
        password:this.registerForm.controls['password'].value
      };

      this.http.post('http://localhost:1337/api/auth/local/register', loginData)
        .subscribe(response => {
          this.route.navigate(['auth'])

        }, (error) => {
          alert('Please check on email or password')
        });
    }

  }
  }
