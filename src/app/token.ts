import {DOCUMENT} from '@angular/common';
import {inject, InjectionToken} from '@angular/core';

export const WINDOW = new InjectionToken<Window>(
  'An abstraction over global window object',
  {
    factory: () => {
      const {defaultView} = inject(DOCUMENT);

      if (!defaultView) {
        throw new Error('Window is not available');
      }

      return defaultView;
    },
  },
);

export const tokens = [
  {
    provide: WINDOW,
    deps: [DOCUMENT],
    useFactory: (document: Document) => {
      const window = document.defaultView;
      return window;
    }
  }
]
