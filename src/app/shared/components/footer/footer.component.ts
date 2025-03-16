import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',  encapsulation: ViewEncapsulation.None  // هذا يعطل الـ ViewEncapsulation

})
export class FooterComponent {
  currentYear: Number = new Date().getFullYear();}
