import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent  implements OnInit, OnDestroy{
  eventTime: Date = new Date('2025-03-25T18:00:00');  // Event date and time
  remainingTime: string = '';
  timer: any;

  ngOnInit() {
    // this.startCountdown();
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
