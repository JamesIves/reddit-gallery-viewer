import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http'
import {ComponentFixture, TestBed} from '@angular/core/testing'
import {FormsModule} from '@angular/forms'
import {findEl, setFieldValue} from 'src/app/util/spec'
import {RedditService} from 'src/services/reddit/reddit.service'
import {SearchComponent} from './search.component'

describe('SearchComponent', () => {
  let component: SearchComponent
  let fixture: ComponentFixture<SearchComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent, FormsModule],
      providers: [RedditService, provideHttpClient(withInterceptorsFromDi())]
    }).compileComponents()

    fixture = TestBed.createComponent(SearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('toggles the currently viewed page when the form is submitted', () => {
    const form = findEl(fixture, 'search-form')
    expect(findEl(fixture, 'search-term').nativeElement.placeholder).toBe(
      'cats'
    )

    setFieldValue(fixture, 'search-term', 'wow')
    form.triggerEventHandler('submit', null)
    fixture.detectChanges()

    expect(findEl(fixture, 'search-term').nativeElement.placeholder).toBe('wow')
  })
})
