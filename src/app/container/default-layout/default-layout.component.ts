import { Component } from '@angular/core';
import { HaederComponent } from "../../shared/components/haeder/haeder.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "../../@views/home/home.component";

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [HaederComponent, FooterComponent, RouterOutlet, HomeComponent],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss'
})
export class DefaultLayoutComponent {

}
