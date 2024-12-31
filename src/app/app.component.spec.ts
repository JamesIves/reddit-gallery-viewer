import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http'
import {TestBed} from '@angular/core/testing'
import {RouterTestingModule} from '@angular/router/testing'
import {RedditService} from 'src/services/reddit/reddit.service'
import {AppComponent} from './app.component'

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [RedditService, provideHttpClient(withInterceptorsFromDi())]
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it(`should have as title 'reddit-gallery-viewer'`, () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app.title).toEqual('reddit-gallery-viewer')
  })
})
