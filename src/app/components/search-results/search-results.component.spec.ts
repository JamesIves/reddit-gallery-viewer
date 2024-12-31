import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http'
import {ComponentFixture, TestBed} from '@angular/core/testing'
import {findEl} from 'src/app/util/spec'
import {LoaderService} from 'src/services/loader/loader.service'
import {RedditService} from 'src/services/reddit/reddit.service'
import {SearchResultsComponent} from './search-results.component'

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent
  let fixture: ComponentFixture<SearchResultsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsComponent],
      providers: [
        RedditService,
        LoaderService,
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(SearchResultsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('shows a return to top button', () => {
    expect(findEl(fixture, 'search-results-rtt')).toBeTruthy()
  })
})
