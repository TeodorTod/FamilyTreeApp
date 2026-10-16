import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export function provideTranslateTesting(): EnvironmentProviders {
  return importProvidersFrom(TranslateModule.forRoot());
}
