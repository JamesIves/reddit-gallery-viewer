import {enableProdMode} from '@angular/core'
import {bootstrapApplication} from '@angular/platform-browser'
import {AppComponent} from './app/app.component'
import {environment} from './environments/environment'
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http'
import {LoaderInterceptorService} from './services/loader/loader-interceptor.service'

if (environment.production) {
  enableProdMode()
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    }
  ]
}).catch(err => console.error(err))
