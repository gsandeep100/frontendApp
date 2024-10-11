import { TestBed } from '@angular/core/testing';
import { LoggingService } from './logging.service';

describe('LoggingService', () => {
  let service: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggingService);
    spyOn(console, 'log'); // Spy on console.log
    spyOn(console, 'error'); // Spy on console.error
    spyOn(console, 'warn'); // Spy on console.warn
    spyOn(console, 'debug'); // Spy on console.debug
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log info messages', () => {
    service.log('log', 'INFO: Test info message');
    expect(console.log).toHaveBeenCalledWith('INFO: Test info message');
  });

  it('should log error messages', () => {
    service.log('error', 'ERROR: Test error message');
    expect(console.error).toHaveBeenCalledWith('ERROR: Test error message');
  });

  it('should log warning messages', () => {
    service.log('warn', 'WARNING: Test warning message');
    expect(console.warn).toHaveBeenCalledWith('WARNING: Test warning message');
  });

  it('should log debug messages', () => {
    service.log('debug', 'DEBUG: Test debug message');
    expect(console.debug).toHaveBeenCalledWith('DEBUG: Test debug message');
  });
});
