import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { EvntesService } from '../../@core/services/evntes.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { GoogleAnalyticsService } from '../../@core/services/google-analytics.service';
import { filter } from 'rxjs';
import { DataMongoService } from '../../@core/services/data-mongo.service';

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
  eventId!: string;
  event: any = {};

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private eventService: EvntesService,
    private route: ActivatedRoute,
    private router: Router, private googleAnalyticsService: GoogleAnalyticsService,private mongo:DataMongoService
  ) {

  }

  ngOnInit(): void {
    this.minDate = new Date().toISOString().split('T')[0];
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    if (this.eventId) {
      this.loadEventData();
    } else {
      console.error('No paramId found');
    }
    this.editEventForm = this.fb.group({
      nameEvent: ['', Validators.required],
      dateEvent: ['', Validators.required],
    });
    this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd)
    )
    .subscribe((event: any) => {
      // Access urlAfterRedirects from NavigationEnd event
      this.googleAnalyticsService.sendPageView(event.urlAfterRedirects, event.urlAfterRedirects);
    });
}
  loadEventData(): void {
    this.mongo.getById(this.eventId).subscribe(
      (res) => {

        if (res) {

          const selectedItem = res;

          if (selectedItem) {
            this.event = selectedItem;

            const formattedDate = this.formatDateForInput(this.event.eventDate);

            this.editEventForm.patchValue({
              nameEvent: this.event.eventName,
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
  }

  onInputClick(): void {
  }

  updateEvent(): void {
    if (this.editEventForm.invalid) {
      return;
    }

    const updatedData = {

        eventName: this.editEventForm.controls['nameEvent'].value,

        eventDate: this.editEventForm.controls['dateEvent'].value

    };
    if (this.eventId) {
      this.mongo.updateEvent(this.eventId, updatedData).subscribe(
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
