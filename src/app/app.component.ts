import {Component} from '@angular/core';
import {AngularFireRemoteConfig} from '@angular/fire/compat/remote-config';
import {map, Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    'class': 'flex flex-col'
  }
})
export class AppComponent {
  public readonly link$: Observable<string | undefined> = this.angularFireRemoteConfig.strings.pipe(
    map((result: { [key: string]: string | undefined }) => {
      if (Reflect.has(result, 'registrationWaitingListLink')) {
        return result['registrationWaitingListLink'];
      }
      return undefined;
    })
  );

  constructor(
    private readonly angularFireRemoteConfig: AngularFireRemoteConfig,
  ) {

  }

}
