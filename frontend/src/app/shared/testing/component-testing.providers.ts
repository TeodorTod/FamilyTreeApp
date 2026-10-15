import { EnvironmentProviders, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { provideMessageTesting } from './message-testing.providers';
import { provideTranslateTesting } from './translate-testing.providers';

export function provideComponentTesting(): Array<Provider | EnvironmentProviders> {
  return [
    provideRouter([]),
    provideTranslateTesting(),
    provideMessageTesting(),
    { provide: ConfirmationService, useValue: { confirm: () => void 0 } },
  ];
}
