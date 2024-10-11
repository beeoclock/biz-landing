
import { Routes } from '@angular/router';
import {AppComponent} from "./app.component";

export const routes: Routes = [
  {
    path: ':language',
    children: [
      {
        path: '',
        component: AppComponent
      }
    ]
  },
  {
    path: '',
    component: AppComponent
  },
	{
		path: '**',
		redirectTo: '',
	},
	{
		path: '',
		redirectTo: '',
		pathMatch: 'full'
	}
];
