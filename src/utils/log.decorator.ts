import { isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoggingService } from '../app/services/logging.service';
import { environment } from '../environments/environment';

interface LoggerParams {
  type?: 'log' | 'trace' | 'warn' | 'info' | 'debug' | 'error';
  inputs?: boolean;
  outputs?: boolean;
  printInProd?: boolean;
  timeStamp?: boolean;
}

const defaultParams: Required<LoggerParams> = {
  type: 'log',
  inputs: true,
  outputs: true,
  printInProd: false,
  timeStamp: true,
};

export function Log(params?: LoggerParams) {
  const options: Required<LoggerParams> = {
    type: params?.type || defaultParams.type,
    inputs: params?.inputs === undefined ? defaultParams.inputs : params.inputs,
    outputs:
      params?.outputs === undefined ? defaultParams.outputs : params.outputs,
    printInProd:
      params?.printInProd === undefined
        ? defaultParams.printInProd
        : params.printInProd,
    timeStamp:
      params?.timeStamp === undefined
        ? defaultParams.timeStamp
        : params.timeStamp,
  };

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    const loggingService = new LoggingService();

    if (!options.printInProd && (!isDevMode() || environment.production)) {
      return;
    }

    descriptor.value = function (...args: any[]) {
      let paramNames = original
        .toString()
        .match(/\((.*?)\)/)[1]
        .split(',');
      let paramValues: any[] = args.map((v) => v);
      let nameAndValue: any = {};

      if (paramValues.length === paramNames.length) {
        for (let i = 0; i < paramNames.length; i++) {
          nameAndValue = {
            ...nameAndValue,
            ...{ [paramNames[i]]: paramValues[i] },
          };
        }
      }

      const result = original.apply(this, args);

      let timeStamp = '';
      if (options.timeStamp) {
        timeStamp = formatConsoleDate(new Date());
      }

      if (options.inputs && !options.outputs) {
        loggingService.log(
          options.type,
          timeStamp,
          original.name + ' -> IN: ',
          nameAndValue
        );
      } else if (!options.inputs && options.outputs) {
        loggingService.log(
          options.type,
          timeStamp,
          original.name + ' -> OUT: ',
          result
        );
      } else {
        loggingService.log(
          options.type,
          timeStamp,
          original.name + ' -> IN: ',
          nameAndValue,
          ' OUT: ',
          result
        );
      }

      return result;
    };
  };
}

function formatConsoleDate(date: Date) {
  let hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  let milliseconds = date.getMilliseconds();

  return (
    '[' +
    (hour < 10 ? '0' + hour : hour) +
    ':' +
    (minutes < 10 ? '0' + minutes : minutes) +
    ':' +
    (seconds < 10 ? '0' + seconds : seconds) +
    '.' +
    ('00' + milliseconds).slice(-3) +
    ']'
  );
}

// Define the decorator for logging method calls
export function LogMethod(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value; // Save the original method

  // Inject the LoggingService
  const loggingService = new LoggingService();

  if (!isDevMode() || environment.production) {
    return descriptor;
  }

  descriptor.value = function (...args: any[]) {
    // Log method entry

    loggingService.log('info', `Entering method: ${propertyKey}`, { args });

    // Call the original method
    const result = originalMethod.apply(this, args);

    // Log method exit
    loggingService.log('info', `Exiting method: ${propertyKey}`, { result });

    return result;
  };

  return descriptor;
}

export function LogHttpRequest(httpMethod: string = 'GET') {
  return function <T>(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const loggingService = new LoggingService();

    if (!isDevMode() || environment.production) {
      return descriptor;
    }
    descriptor.value = function (...args: any[]): Observable<T> {
      loggingService.log(
        'info',
        `${httpMethod} request initiated: ${propertyKey}`,
        { args }
      );

      const result = originalMethod.apply(this, args);

      return result.pipe(
        tap((response: T) => {
          loggingService.log(
            'info',
            `${httpMethod} request completed: ${propertyKey}`,
            { response }
          );
        }),
        catchError((error) => {
          loggingService.log(
            'error',
            `${httpMethod} request failed: ${propertyKey}`,
            { error }
          );
          throw error;
        })
      );
    };

    return descriptor;
  };
}
