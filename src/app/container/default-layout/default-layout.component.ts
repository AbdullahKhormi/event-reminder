import { Component } from '@angular/core';
import { HaederComponent } from "../../shared/components/haeder/haeder.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [HaederComponent, FooterComponent],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss'
})
export class DefaultLayoutComponent {

}
