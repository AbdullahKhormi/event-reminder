import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { EvntesService } from '../../@core/services/evntes.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // استيراد BrowserAnimationsModule
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule , CalendarModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEventComponent {
  minDate: string = '';

  addEventForm!:FormGroup
  constructor(private fb :FormBuilder , private ev:EvntesService){
this.addEventForm=fb.group({
  nameEvent:['',Validators.required],
  dateEvent:['',Validators.required]
})
  }
  ngOnInit(): void {
    this.setMinDate();
    this.ev.getAllEvents().subscribe(res => {
const dateEvent = new Date(res.data[2].dateEvent);

const localDate = new Date(dateEvent.toLocaleString());

const formattedDate = localDate.toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const formattedTime = localDate.toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});


const result = `${formattedDate} at ${formattedTime}`;

console.log(result);


    });

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
    console.log(isoDate)
    formData.append('data[nameEvent]', this.addEventForm.value.nameEvent);
    formData.append('data[dateEvent]', isoDate);
this.ev.postEvents(formData).subscribe(res=>{
  console.log(res)
})
  }
}
}
