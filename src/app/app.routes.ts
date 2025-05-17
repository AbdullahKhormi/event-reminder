import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './container/default-layout/default-layout.component';
import { HomeComponent } from '../app/@views/home/home.component';
import { CreateEventComponent } from './@views/events/create-event/create-event.component';
import { AllEventComponent } from './@views/events/all-event/all-event.component';
import { LoginComponent } from './auth/login/login.component';
import { NewAccountComponent } from './auth/new-account/new-account.component';
import { AuthGuard } from './@core/guards/auth.guard';
import { EditEventComponent } from './@views/events/edit-event/edit-event.component';
import { NotFoundComponent } from './auth/not-found/not-found.component';
import { UsersComponent } from './auth/users/users.component';
import { EditUsersComponent } from './auth/users/edit-users/edit-users.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { ResetPasswordComponent } from './auth/reset-passwrd/reset-passwrd.component';
import { VerifyOtpComponent } from './auth/verify-otp/verify-otp.component';

export const routes: Routes = [
  {
    path:'',
    redirectTo:'auth',
    pathMatch:'full'
        },
        {path:'auth',
          // component:LoginComponent
          loadComponent:()=>import('./auth/login/login.component').then(component=>component.LoginComponent)

        },
        {path:'registeration',
          // component:NewAccountComponent
        loadComponent:()=>import('./auth/new-account/new-account.component').then(component=>component.NewAccountComponent)        },
        {path:'verify-email',
          // component:VerifyEmailComponent,
        loadComponent:()=>import('./auth/verify-email/verify-email.component').then(component=>component.VerifyEmailComponent)
        },
        {path:'otp',
          // component:VerifyOtpComponent,
loadComponent:()=>import('./auth/verify-otp/verify-otp.component').then(component=>component.VerifyOtpComponent)

        },
        {path:'reset-password/:token',

          // component:ResetPasswordComponent,
        loadComponent:()=>import('./auth/reset-passwrd/reset-passwrd.component').then(component=>component.ResetPasswordComponent)
        },
  {
    path: '',
    // component: DefaultLayoutComponent,
    loadComponent:()=>import('./container/default-layout/default-layout.component').then(component=>component.DefaultLayoutComponent),
    children: [
      {
        path: '', // Default child route
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        // component: HomeComponent,
        loadComponent:()=>import('./@views/home/home.component').then(component=>component.HomeComponent),
        canActivate:[AuthGuard]

      },
      {
        path: 'add-events',
        component: CreateEventComponent,
        // loadComponent:()=>import('./@views/events/create-event/create-event.component').then(component=>component.CreateEventComponent),
        canActivate:[AuthGuard]
      },
      {
        path: 'all-events',
        // component: AllEventComponent,
        loadComponent:()=>import('./@views/events/all-event/all-event.component').then(component=>component.AllEventComponent),
        canActivate:[AuthGuard]

      },
      {
        path: 'edit-events/:id',
        // component: EditEventComponent,
        loadComponent:()=>import('./@views/events/edit-event/edit-event.component').then(component=>component.EditEventComponent),
        canActivate:[AuthGuard]

      },
        {path:'users',
        // component:UsersComponent,
        loadComponent:()=>import('./auth/users/users.component').then(component=>component.UsersComponent),
        canActivate:[AuthGuard]
      },
      {
        path: 'edit-users/:id',
        // component: EditUsersComponent,
        loadComponent:()=>import('./auth/users/edit-users/edit-users.component').then(component=>component.EditUsersComponent),
        canActivate:[AuthGuard]

      },


    ],

  },
  {path:'**',

    // component:NotFoundComponent
loadComponent:()=>import('./auth/not-found/not-found.component').then(component=>component.NotFoundComponent)
  },
];
