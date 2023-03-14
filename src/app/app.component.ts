import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    'class': 'cover-container d-flex w-100 h-100 p-3 mx-auto flex-column'
  }
})
export class AppComponent {
  title = 'biz-landing';
}
