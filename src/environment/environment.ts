// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    apiKey: "AIzaSyDpqktdOQyijnyCaiaOl3_DxUQhTu3PjUg",
    authDomain: "beeoclock-develop.firebaseapp.com",
    projectId: "beeoclock-develop",
    storageBucket: "beeoclock-develop.appspot.com",
    messagingSenderId: "957741407419",
    appId: "1:957741407419:web:4c7e90f6e06f697daa5d9e"
  },
  production: false,
  config: {
    language: 'en',
    host: 'http://localhost:4200',
    consultationLink: 'https://beeoclock.com/office',
    demoAccount: {
      panelUrl: 'https://panel.dev.beeoclock.com/identity',
      login: 'demo@beeoclock.com',
      password: 'ItIckBeRSOLDENZYGosicirE'
    }
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
