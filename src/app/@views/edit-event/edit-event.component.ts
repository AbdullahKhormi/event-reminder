import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { EvntesService } from '../../@core/services/evntes.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  standalone: true,

  imports: [ReactiveFormsModule , CalendarModule,    ToastModule,  CommonModule],
    providers: [MessageService],
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {

  editEventForm!: FormGroup;
  minDate!: string;
  eventId!: number;
  event: any = {};

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private eventService: EvntesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.minDate = new Date().toISOString().split('T')[0];
    this.eventId = +this.route.snapshot.paramMap.get('id')!;
    if (this.eventId) {
      this.loadEventData();
    } else {
      console.error('No paramId found');
    }
    this.editEventForm = this.fb.group({
      nameEvent: ['', Validators.required],
      dateEvent: ['', Validators.required],
    });

  }
  loadEventData(): void {
    this.eventService.getEventById(this.eventId).subscribe(
      (res) => {
        console.log(res.data)
        if (res.data) {

          const selectedItem = res.data;
          if (selectedItem) {
            this.event = selectedItem;
            console.log(this.event.dateEvent)
            const formattedDate = this.formatDateForInput(this.event.dateEvent);

            this.editEventForm.patchValue({
              nameEvent: this.event.nameEvent,
              dateEvent: formattedDate
            });
          }
        }
      },
      (error) => {
        console.error('Error loading event data:', error);
      }
    );
  }
  formatDateForInput(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  onDateChange(): void {
    console.log('Date changed:', this.editEventForm.get('dateEvent')?.value);
  }

  onInputClick(): void {
    console.log('Input clicked');
  }

  updateEvent(): void {
    if (this.editEventForm.invalid) {
      return;
    }

    const updatedData = {
      data: {
        nameEvent: this.editEventForm.controls['nameEvent'].value,

        dateEvent: this.editEventForm.controls['dateEvent'].value
      }
    };
    if (this.eventId) {
      this.eventService.updateData(this.eventId, updatedData).subscribe(
        (response) => {
          setTimeout(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Event Updates Successfully`,
            });  }, 2200);
            setTimeout(() => {
              this.router.navigate(['./all-events'])
            }, 3500);
          },(error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Event Updated Unsuccessfully`,
            });
          }
      );
    } else {
      console.error('No event ID found');
    }
  }



}
