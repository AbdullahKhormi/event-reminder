import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { EvntesService } from '../../@core/services/evntes.service';
import { CommonModule, DatePipe } from '@angular/common';
import { filter } from 'rxjs';
import { GoogleAnalyticsService } from '../../@core/services/google-analytics.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,CommonModule],
  providers:[DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent  implements OnInit, OnDestroy{
  eventTime: Date = new Date('2025-03-25T18:00:00');  // Event date and time
  remainingTime: string = '';
  timer: any;
  isShow=false
  events:any[]=[]
  closestEvent: any;

  constructor(private ev :EvntesService,private router: Router, private googleAnalyticsService: GoogleAnalyticsService ,private http:HttpClient){

  }
  ngOnInit() {

    // this.startCountdown();

    this.getClosestEvent()

    this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd)
    )
    .subscribe((event: any) => {
      // Access urlAfterRedirects from NavigationEnd event
      this.googleAnalyticsService.sendPageView(event.urlAfterRedirects, event.urlAfterRedirects);
    });
}
  getClosestEvent() {
    // this.ev.getData().subscribe((res:any)=>{
    //   this.events=res.data.results
    //   const currentDate = new Date();

    //   // Sort events by dateEvent (ascending)
    //   this.events.sort((a, b) => new Date(a.dateEvent).getTime() - new Date(b.dateEvent).getTime());

    //   // Find the closest event that is in the future
    //   for (let event of this.events) {
    //     if (new Date(event.dateEvent).getTime() > currentDate.getTime()) {
    //       this.closestEvent = event;
    //       break;
    //     }
    //   }          })


  }
  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);  // Clean up the timer when the component is destroyed
    }
  }

  startCountdown() {
    this.timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = this.eventTime.getTime() - now;

      // Calculate time remaining
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Format remaining time as a string
      this.remainingTime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      // If the event is over
      if (distance < 0) {
        clearInterval(this.timer);  // Stop the timer
        this.remainingTime = 'Event has ended';
      }
    }, 1000);  // Update the countdown every second
  }

}
