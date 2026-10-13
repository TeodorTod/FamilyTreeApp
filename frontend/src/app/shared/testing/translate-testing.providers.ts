import { EnvironmentProviders } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';

export function provideTranslateTesting(): EnvironmentProviders {
  return provideTranslateService();
}
