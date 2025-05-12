import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { DataMongoService } from '../../@core/services/data-mongo.service';

@Component({
  selector: 'app-reset-passwrd',
  standalone: true,
  imports: [ReactiveFormsModule ,ToastModule,CommonModule,RouterModule],
  providers: [MessageService],

  templateUrl: './reset-passwrd.component.html',
  styleUrl: './reset-passwrd.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';
receiveEm=''
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService ,private receiveEmail:DataMongoService
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

resetPassword() {
  if (this.resetPasswordForm.valid) {
    const emailR=localStorage.getItem('resetEmail')

    const { newPassword } = this.resetPasswordForm.value;
    this.http.post(`http://localhost:3000/users/reset-password`, {
      email: emailR,
      newPassword
    }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password reset successfully' });
        setTimeout(() => {
          this.router.navigate(['/auth']);
        }, 2000);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to reset password' });
      }
    });
  }
}
}
