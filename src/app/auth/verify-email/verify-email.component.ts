import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DataMongoService } from '../../@core/services/data-mongo.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ToastModule,ReactiveFormsModule,CommonModule, RouterModule],
  providers:[MessageService],

  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent {
  verifyEmailForm!:FormGroup
  constructor(private fb: FormBuilder,private messageService:MessageService, private forgotPass:DataMongoService) {
    this.verifyEmailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }



  sendVerificationEmail() {
    if (this.verifyEmailForm.valid) {
      const data={
        email:this.verifyEmailForm.controls['email'].value
      }
      console.log('Sending verification to:', data);
      this.forgotPass.verfiEmail(data).subscribe(res=>{

      })
    }
  }
}
