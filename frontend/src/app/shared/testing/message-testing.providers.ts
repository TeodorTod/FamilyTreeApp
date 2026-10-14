import { Provider } from '@angular/core';
import { MessageService } from 'primeng/api';

export function provideMessageTesting(): Provider {
  return {
    provide: MessageService,
    useValue: {
      add: () => void 0,
      addAll: () => void 0,
      clear: () => void 0,
    },
  };
}
