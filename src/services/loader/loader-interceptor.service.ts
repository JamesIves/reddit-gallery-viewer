import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';

/**
 * The Loader Interceptor observes incoming/outgoing requests
 * and uses the spy to inform the LoaderService when to toggle
 * the loading stare.
 */
@Injectable({
  providedIn: 'root',
})
export class LoaderInterceptorService {
  private activeRequests: number = 0;

  constructor(private readonly loaderService: LoaderService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.activeRequests === 0) {
      this.loaderService.start();
    }

    this.activeRequests++;

    return next.handle(request).pipe(
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.loaderService.stop();
        }
      })
    );
  }
}
