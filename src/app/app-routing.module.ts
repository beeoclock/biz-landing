import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {languageCanActiveRouter} from "../common/router/can-active/language.can-active.router";

const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: ':language',
    canActivate: [
        languageCanActiveRouter
    ],
    children: [
      {
        path: '',
        component: AppComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
