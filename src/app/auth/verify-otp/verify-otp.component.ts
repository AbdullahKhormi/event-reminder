import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataMongoService } from '../../@core/services/data-mongo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
@Component({

  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
  providers: [MessageService],
  imports: [ToastModule, CommonModule, ReactiveFormsModule, RouterModule],
  standalone: true,

})
export class VerifyOtpComponent implements AfterViewInit,OnInit {
  otpForm!: FormGroup;
  token=''
@ViewChild('otp1') otp1Field!: ElementRef;
receiveEmailS=''
  constructor(private fb: FormBuilder, private dataMongoService: DataMongoService , private location:Location,private receiveEmail:DataMongoService , private router :Router,private route:ActivatedRoute) {
    this.otpForm = this.fb.group({
      otp1: ['', [Validators.required, Validators.pattern(/^[0-9]{1}$/)]],
      otp2: ['', [Validators.required, Validators.pattern(/^[0-9]{1}$/)]],
      otp3: ['', [Validators.required, Validators.pattern(/^[0-9]{1}$/)]],
      otp4: ['', [Validators.required, Validators.pattern(/^[0-9]{1}$/)]],
      otp5: ['', [Validators.required, Validators.pattern(/^[0-9]{1}$/)]],
      otp6: ['', [Validators.required, Validators.pattern(/^[0-9]{1}$/)]]
    });
  }
ngAfterViewInit(): void {
  setTimeout(() => {
    this.otp1Field?.nativeElement.focus();
  }, 0);
}
ngOnInit(){
      this.token = this.route.snapshot.paramMap.get('token') || '';


}
onInput(event: Event, currentIndex: number) {
  const input = event.target as HTMLInputElement;
  if (input.value.length === 1 && currentIndex < 6) {
    const nextInput = document.getElementsByName(`otp${currentIndex + 1}`)[0] as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }
}

onKeyDown(event: KeyboardEvent, index: number) {
  const key = event.key;

  if (!/^[0-9]$/.test(key) && key !== 'Backspace' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
    event.preventDefault();
    return;
  }

  const input = event.target as HTMLInputElement;

  if (key === 'Backspace' && input.value === '' && index > 1) {
    const prevInput = document.getElementsByName(`otp${index - 1}`)[0] as HTMLInputElement;
    if (prevInput) prevInput.focus();
  }
}

  verifyOtp() {
    if (this.otpForm.valid) {
          const emailR=localStorage.getItem('resetEmail')

      const otp = Object.values(this.otpForm.value).join('');
      this.dataMongoService.verifyOtp(emailR, otp).subscribe(
        response => {
          this.router.navigateByUrl(`reset-password/${this.token}`)
          console.log('OTP Verified Successfully:', response);
          // Show success message or redirect to another page
        },
        error => {
          console.error('Error verifying OTP:', error);
          // Show error message to the user
        }
      );
    }
  }
  back(){
    this.location.back()
  }
}