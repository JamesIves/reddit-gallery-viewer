import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import {ComponentFixture, TestBed} from '@angular/core/testing'
import {click, findEl} from 'src/app/util/spec'
import {RedditService} from 'src/services/reddit/reddit.service'

import {SafeModeComponent} from './safe-mode.component'

describe('SafeModeComponent', () => {
  let component: SafeModeComponent
  let fixture: ComponentFixture<SafeModeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SafeModeComponent],
    providers: [RedditService, provideHttpClient(withInterceptorsFromDi())]
}).compileComponents()

    fixture = TestBed.createComponent(SafeModeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('renders a modal when safe mode is disabled and the toggle is clicked', () => {
    expect(
      findEl(fixture, 'safemode-dialog').nativeElement.classList.contains(
        'active'
      )
    ).toBeFalsy()

    click(fixture, 'safemode-toggle')
    fixture.detectChanges()

    expect(
      findEl(fixture, 'safemode-dialog').nativeElement.classList.contains(
        'active'
      )
    ).toBeTruthy()
  })

  it('enables safe mode when the confirm button within the modal is clicked', () => {
    expect(
      findEl(fixture, 'safemode-dialog').nativeElement.classList.contains(
        'active'
      )
    ).toBeFalsy()
    expect(
      findEl(fixture, 'safemode-toggle').nativeElement.classList.contains(
        'active'
      )
    ).toBeFalsy()

    click(fixture, 'safemode-toggle')
    fixture.detectChanges()

    expect(
      findEl(fixture, 'safemode-dialog').nativeElement.classList.contains(
        'active'
      )
    ).toBeTruthy()

    click(fixture, 'safemode-enable')
    fixture.detectChanges()

    expect(
      findEl(fixture, 'safemode-toggle').nativeElement.classList.contains(
        'active'
      )
    ).toBeTruthy()
  })

  it('disables safe mode when already enabled without the modal showing up', () => {
    expect(
      findEl(fixture, 'safemode-dialog').nativeElement.classList.contains(
        'active'
      )
    ).toBeFalsy()
    expect(
      findEl(fixture, 'safemode-toggle').nativeElement.classList.contains(
        'active'
      )
    ).toBeFalsy()

    click(fixture, 'safemode-toggle')
    fixture.detectChanges()

    expect(
      findEl(fixture, 'safemode-dialog').nativeElement.classList.contains(
        'active'
      )
    ).toBeTruthy()

    click(fixture, 'safemode-enable')
    fixture.detectChanges()

    expect(
      findEl(fixture, 'safemode-toggle').nativeElement.classList.contains(
        'active'
      )
    ).toBeTruthy()

    click(fixture, 'safemode-toggle')
    fixture.detectChanges()

    expect(
      findEl(fixture, 'safemode-dialog').nativeElement.classList.contains(
        'active'
      )
    ).toBeFalsy()
  })
})
