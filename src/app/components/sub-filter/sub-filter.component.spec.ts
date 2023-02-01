import {HttpClientModule} from '@angular/common/http'
import {ComponentFixture, TestBed} from '@angular/core/testing'
import {RedditService} from 'src/services/reddit/reddit.service'

import {SubFilterComponent} from './sub-filter.component'

describe('SubFilterComponent', () => {
  let component: SubFilterComponent
  let fixture: ComponentFixture<SubFilterComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubFilterComponent, HttpClientModule],
      providers: [RedditService]
    }).compileComponents()

    fixture = TestBed.createComponent(SubFilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('toggles to the all filter when selected', () => {})

  it('toggles to the hour filter when selected', () => {})

  it('toggles to the week filter when selected', () => {})

  it('toggles to the month filter when selected', () => {})

  it('toggles to the year filter when selected', () => {})
})
