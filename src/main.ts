import {enableProdMode} from '@angular/core'
import {bootstrapApplication} from '@angular/platform-browser'
import {AppComponent} from './app/app.component'
import {environment} from './environments/environment'

import {importProvidersFrom} from '@angular/core'
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import {LoaderInterceptorService} from './services/loader/loader-interceptor.service'

if (environment.production) {
  enableProdMode()
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    }
  ]
}).catch(err => console.error(err))
