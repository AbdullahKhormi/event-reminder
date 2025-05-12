import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DataMongoService } from '../../@core/services/data-mongo.service';
import { error } from 'console';

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
  constructor(private fb: FormBuilder,private messageService:MessageService, private forgotPass:DataMongoService,private sendEmail:DataMongoService,private router:Router,) {
    this.verifyEmailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }



  sendVerificationEmail() {
    if (this.verifyEmailForm.valid) {
      const data={
        email:this.verifyEmailForm.controls['email'].value
      }
      this.forgotPass.verfiEmail(data).subscribe(res=>{
        const sendEm=data.email
   localStorage.setItem('resetEmail', sendEm);


this.router.navigateByUrl("otp")
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Email sent successfully'
        });
      }
    ,(error)=>{
      let errorMessage = error.error.message || 'Something went wrong. Please try again later.';

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
      });
    }
  )



    }
  }
}
