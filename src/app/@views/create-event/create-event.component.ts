import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { EvntesService } from '../../@core/services/evntes.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // <-- Import this
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [ReactiveFormsModule , CalendarModule,    ToastModule,  CommonModule,  // Keep this instead of BrowserModule

  ],
  providers: [MessageService],

  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent {
  minDate: string = '';

  addEventForm!:FormGroup
  constructor(private fb :FormBuilder , private ev:EvntesService,private messageService :MessageService ,private router:Router){
this.addEventForm=fb.group({
  nameEvent:['',Validators.required],
  dateEvent:['',Validators.required]
})
  }
  ngOnInit(): void {
    this.setMinDate();
//     this.ev.getAllEvents().subscribe(res => {
// const dateEvent = new Date(res.data[2].dateEvent);

// const localDate = new Date(dateEvent.toLocaleString());

// const formattedDate = localDate.toLocaleDateString('en-US', {
//   weekday: 'long',
//   year: 'numeric',
//   month: 'long',
//   day: 'numeric',
// });

// const formattedTime = localDate.toLocaleTimeString('en-US', {
//   hour: '2-digit',
//   minute: '2-digit',
//   hour12: true,
// });


// const result = `${formattedDate} at ${formattedTime}`;



//     });

  }
  setMinDate(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');

    this.minDate = `${year}-${month}-${day}T${hours}:${minutes}`;
  }
addEvent(){

  if(this.addEventForm.valid){
    const formData = new FormData();
    const dateEventValue = this.addEventForm.value.dateEvent
    const date = new Date(dateEventValue);
    const isoDate = date.toISOString();
    formData.append('data[nameEvent]', this.addEventForm.value.nameEvent);
    formData.append('data[dateEvent]', isoDate);
this.ev.postData(formData).subscribe(res=>{
  setTimeout(() => {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `Event Added Successfully`,
    });  }, 2200);
    setTimeout(() => {
      this.router.navigate(['./all-events'])
    }, 3500);
  },(error) => {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: `Event Added Unsuccessfully`,
    });
  }

)

  }
}
onDateChange(){
  const dateInput = document.getElementById('dateEvent') as HTMLInputElement;
  dateInput.blur();
}
onInputClick() {
  const dateInput = document.getElementById('dateEvent') as HTMLInputElement;

  dateInput.focus();
}

}
