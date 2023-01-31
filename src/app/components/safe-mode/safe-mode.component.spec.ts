import {ComponentFixture, TestBed} from '@angular/core/testing'

import {SafeModeComponent} from './safe-mode.component'

describe('SafeModeComponent', () => {
  let component: SafeModeComponent
  let fixture: ComponentFixture<SafeModeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafeModeComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(SafeModeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('renders a modal when safe mode is disabled and the toggle is clicked', () => {})

  it('enables safe mode when the confirm button within the modal is clicked', () => {})

  it('disables safe mode when already enabled without the modal showing up', () => {})
})
