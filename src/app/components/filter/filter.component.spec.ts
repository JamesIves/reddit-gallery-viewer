import {ComponentFixture, TestBed} from '@angular/core/testing'

import {FilterComponent} from './filter.component'

describe('FilterComponent', () => {
  let component: FilterComponent
  let fixture: ComponentFixture<FilterComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(FilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('toggles to the hot filter when clicked', () => {})

  it('toggles to the new filter when clicked', () => {})

  it('toggles to the top filter when clicked', () => {})

  it('toggles to the rising filter when clicked', () => {})
})
