import { Injectable, isDevMode } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  log(
    logType: 'log' | 'warn' | 'info' | 'debug' | 'error' | 'trace',
    ...args: any[]
  ) {
    if (!environment.production || isDevMode()) {
      console[logType](...args);
    }
  }
}
