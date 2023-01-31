import {Injectable} from '@angular/core'
import {HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http'
import {Observable} from 'rxjs'
import {finalize} from 'rxjs/operators'
import {LoaderService} from './loader.service'

/**
 * The Loader Interceptor observes incoming/outgoing requests
 * and uses the spy to inform the {@see LoaderService} when to toggle
 * the loading stare.
 */
@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptorService {
  private activeRequests = 0

  constructor(private readonly loaderService: LoaderService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.activeRequests === 0) {
      this.loaderService.start()
    }

    this.activeRequests++

    return next.handle(request).pipe(
      finalize(() => {
        this.activeRequests--
        if (this.activeRequests === 0) {
          this.loaderService.stop()
        }
      })
    )
  }
}
