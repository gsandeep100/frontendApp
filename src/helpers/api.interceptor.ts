import { HttpInterceptorFn } from '@angular/common/http';
import config from '../config/config';

export const ApiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = config.apiUrl;
  // Check if the request URL is a relative path
  if (!req.url.startsWith('http://') && !req.url.startsWith('https://')) {
    // Clone and modify the request with the base URL
    const apiReq = req.clone({
      url: `${apiUrl}${req.url}`,
    });
    return next(apiReq);
  }
  return next(req);
};
