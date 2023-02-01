import {HttpClientModule} from '@angular/common/http'
import {ComponentFixture, TestBed} from '@angular/core/testing'
import {RedditService} from 'src/services/reddit/reddit.service'

import {SearchResultsComponent} from './search-results.component'

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent
  let fixture: ComponentFixture<SearchResultsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsComponent, HttpClientModule],
      providers: [RedditService]
    }).compileComponents()

    fixture = TestBed.createComponent(SearchResultsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('displays the search results', () => {})

  it('displays an empty state when there is nothing to display', () => {})
})
