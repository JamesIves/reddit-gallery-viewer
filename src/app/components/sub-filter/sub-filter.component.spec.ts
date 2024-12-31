import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http'
import {ChangeDetectionStrategy} from '@angular/core'
import {ComponentFixture, TestBed} from '@angular/core/testing'
import {RedditSubFilter} from 'src/app/models/reddit.model'
import {findEl, setFieldElementValue} from 'src/app/util/spec'
import {RedditService} from 'src/services/reddit/reddit.service'
import {SubFilterComponent} from './sub-filter.component'

describe('SubFilterComponent', () => {
  let component: SubFilterComponent
  let fixture: ComponentFixture<SubFilterComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubFilterComponent],
      providers: [RedditService, provideHttpClient(withInterceptorsFromDi())]
    })
      .overrideComponent(SubFilterComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default
        }
      })

      .compileComponents()

    fixture = TestBed.createComponent(SubFilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('toggles to the all filter when selected', () => {
    const subfilter = findEl(fixture, 'subfilter')

    expect(findEl(fixture, 'subfilter-all').nativeElement.selected).toBeTruthy()

    setFieldElementValue(subfilter.nativeElement, RedditSubFilter.HOUR)
    fixture.detectChanges()

    expect(
      findEl(fixture, 'subfilter-hour').nativeElement.selected
    ).toBeTruthy()
    expect(findEl(fixture, 'subfilter-all').nativeElement.selected).toBeFalsy()

    setFieldElementValue(subfilter.nativeElement, RedditSubFilter.ALL)
    fixture.detectChanges()

    expect(findEl(fixture, 'subfilter-all').nativeElement.selected).toBeTruthy()
  })

  it('toggles to the hour filter when selected', () => {
    const subfilter = findEl(fixture, 'subfilter')

    expect(findEl(fixture, 'subfilter-hour').nativeElement.selected).toBeFalsy()

    setFieldElementValue(subfilter.nativeElement, RedditSubFilter.HOUR)
    fixture.detectChanges()

    expect(
      findEl(fixture, 'subfilter-hour').nativeElement.selected
    ).toBeTruthy()
  })

  it('toggles to the week filter when selected', () => {
    const subfilter = findEl(fixture, 'subfilter')

    expect(findEl(fixture, 'subfilter-week').nativeElement.selected).toBeFalsy()

    setFieldElementValue(subfilter.nativeElement, RedditSubFilter.WEEK)
    fixture.detectChanges()

    expect(
      findEl(fixture, 'subfilter-week').nativeElement.selected
    ).toBeTruthy()
  })

  it('toggles to the month filter when selected', () => {
    const subfilter = findEl(fixture, 'subfilter')

    expect(
      findEl(fixture, 'subfilter-month').nativeElement.selected
    ).toBeFalsy()

    setFieldElementValue(subfilter.nativeElement, RedditSubFilter.MONTH)
    fixture.detectChanges()

    expect(
      findEl(fixture, 'subfilter-month').nativeElement.selected
    ).toBeTruthy()
  })

  it('toggles to the year filter when selected', () => {
    const subfilter = findEl(fixture, 'subfilter')

    expect(findEl(fixture, 'subfilter-year').nativeElement.selected).toBeFalsy()

    setFieldElementValue(subfilter.nativeElement, RedditSubFilter.YEAR)
    fixture.detectChanges()

    expect(
      findEl(fixture, 'subfilter-year').nativeElement.selected
    ).toBeTruthy()
  })
})
