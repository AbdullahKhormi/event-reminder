import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../@core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userName:any

constructor(private auth:AuthService){
  this.userName=localStorage.getItem('username')
}
logout(){
  this.auth.logout()
}
}
