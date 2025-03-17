/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .then((ref) => {

    // Ensure Angular destroys itself on hot reloads.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window["ngRef"]?.destroy();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window["ngRef"] = ref;

  })
  .catch((err) => console.error(err));
