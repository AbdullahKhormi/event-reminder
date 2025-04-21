import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../@core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule ,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userName:any
  menuOpen=true
  show=false
  showHome=false
  usersRoles:any |undefined
constructor(private auth:AuthService){
  this.userName=localStorage.getItem('username')
  const roles = localStorage.getItem('roles')
  this.usersRoles=roles
  if(roles==='admin'){this.show=true
    this.showHome=true

  }
}
logout(){
  this.auth.logout()
}
}
