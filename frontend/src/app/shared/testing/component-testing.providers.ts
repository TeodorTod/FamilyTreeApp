import { EnvironmentProviders, Provider } from '@angular/core';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { of } from 'rxjs';
import { provideMessageTesting } from './message-testing.providers';
import { provideTranslateTesting } from './translate-testing.providers';

export function provideComponentTesting(): Array<Provider | EnvironmentProviders> {
  return [
    provideRouter([]),
    provideTranslateTesting(),
    provideMessageTesting(),
    {
      provide: ActivatedRoute,
      useValue: {
        snapshot: {
          paramMap: convertToParamMap({}),
          queryParamMap: convertToParamMap({}),
          params: {},
          queryParams: {},
        },
        params: of({}),
        queryParams: of({}),
      },
    },
    { provide: ConfirmationService, useValue: { confirm: () => void 0 } },
  ];
}
