import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './container/default-layout/default-layout.component';
import { HomeComponent } from '../app/@views/home/home.component';
import { CreateEventComponent } from './@views/create-event/create-event.component';
import { AllEventComponent } from './@views/all-event/all-event.component';

export const routes: Routes = [
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
      },
      {
        path: 'add-events',
        component: CreateEventComponent,
      },
      {
        path: 'all-events',
        component: AllEventComponent,
      },
    ],
  },
];
