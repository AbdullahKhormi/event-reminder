import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './container/default-layout/default-layout.component';
import { HomeComponent } from '../app/@views/home/home.component';
import { CreateEventComponent } from './@views/create-event/create-event.component';
import { AllEventComponent } from './@views/all-event/all-event.component';
import { LoginComponent } from './auth/login/login.component';
import { NewAccountComponent } from './auth/new-account/new-account.component';
import { AuthGuard } from './@core/guards/auth.guard';
import { EditEventComponent } from './@views/edit-event/edit-event.component';
import { NotFoundComponent } from './auth/not-found/not-found.component';
import { UsersComponent } from './auth/users/users.component';
import { EditUsersComponent } from './auth/users/edit-users/edit-users.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { ResetPasswordComponent } from './auth/reset-passwrd/reset-passwrd.component';

export const routes: Routes = [
  {
    path:'',
    redirectTo:'auth',
    pathMatch:'full'
        },
        {path:'auth',component:LoginComponent},
        {path:'registeration',component:NewAccountComponent},
        {path:'verify-email',component:VerifyEmailComponent},
        {path:'reset-password/:token',component:ResetPasswordComponent},
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '', // Default child route
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate:[AuthGuard]

      },
      {
        path: 'add-events',
        component: CreateEventComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'all-events',
        component: AllEventComponent,
        canActivate:[AuthGuard]

      },
      {
        path: 'edit-events/:id',
        component: EditEventComponent,
        canActivate:[AuthGuard]

      },
      {
        path: 'edit-users/:id',
        component: EditUsersComponent,
        canActivate:[AuthGuard]

      },
      {path:'users',component:UsersComponent,canActivate:[AuthGuard]}

    ],

  },
  {path:'**',component:NotFoundComponent},
];
