import {HttpClientModule} from '@angular/common/http'
import {ComponentFixture, TestBed} from '@angular/core/testing'
import {RedditService} from 'src/services/reddit/reddit.service'

import {SearchComponent} from './search.component'

describe('SearchComponent', () => {
  let component: SearchComponent
  let fixture: ComponentFixture<SearchComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent, HttpClientModule],
      providers: [RedditService]
    }).compileComponents()

    fixture = TestBed.createComponent(SearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('toggles the currently viewed page when the form is submitted', () => {})
})
