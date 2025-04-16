import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http'
import {ComponentFixture, TestBed} from '@angular/core/testing'
import {click, findEl} from 'src/app/util/spec'
import {RedditService} from 'src/services/reddit/reddit.service'
import {FilterComponent} from './filter.component'

describe('FilterComponent', () => {
  let component: FilterComponent
  let fixture: ComponentFixture<FilterComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterComponent],
      providers: [RedditService, provideHttpClient(withInterceptorsFromDi())]
    }).compileComponents()

    fixture = TestBed.createComponent(FilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('toggles to the hot filter when clicked', () => {
    expect(
      findEl(fixture, 'filter-all').nativeElement.classList.contains('active')
    ).toBeTruthy()
    expect(
      findEl(fixture, 'filter-hot').nativeElement.classList.contains('active')
    ).toBeFalsy()

    click(fixture, 'filter-hot')
    fixture.detectChanges()

    expect(
      findEl(fixture, 'filter-all').nativeElement.classList.contains('active')
    ).toBeFalsy()
    expect(
      findEl(fixture, 'filter-hot').nativeElement.classList.contains('active')
    ).toBeTruthy()

    click(fixture, 'filter-all')
    fixture.detectChanges()

    expect(
      findEl(fixture, 'filter-all').nativeElement.classList.contains('active')
    ).toBeTruthy()
    expect(
      findEl(fixture, 'filter-hot').nativeElement.classList.contains('active')
    ).toBeFalsy()
  })

  it('toggles to the new filter when clicked', () => {
    expect(
      findEl(fixture, 'filter-all').nativeElement.classList.contains('active')
    ).toBeTruthy()
    expect(
      findEl(fixture, 'filter-new').nativeElement.classList.contains('active')
    ).toBeFalsy()

    click(fixture, 'filter-new')
    fixture.detectChanges()

    expect(
      findEl(fixture, 'filter-all').nativeElement.classList.contains('active')
    ).toBeFalsy()
    expect(
      findEl(fixture, 'filter-new').nativeElement.classList.contains('active')
    ).toBeTruthy()
  })

  it('toggles to the top filter when clicked', () => {
    expect(
      findEl(fixture, 'filter-all').nativeElement.classList.contains('active')
    ).toBeTruthy()
    expect(
      findEl(fixture, 'filter-top').nativeElement.classList.contains('active')
    ).toBeFalsy()

    click(fixture, 'filter-top')
    fixture.detectChanges()

    expect(
      findEl(fixture, 'filter-all').nativeElement.classList.contains('active')
    ).toBeFalsy()
    expect(
      findEl(fixture, 'filter-top').nativeElement.classList.contains('active')
    ).toBeTruthy()
  })

  it('toggles to the rising filter when clicked', () => {
    expect(
      findEl(fixture, 'filter-all').nativeElement.classList.contains('active')
    ).toBeTruthy()
    expect(
      findEl(fixture, 'filter-rising').nativeElement.classList.contains(
        'active'
      )
    ).toBeFalsy()

    click(fixture, 'filter-rising')
    fixture.detectChanges()

    expect(
      findEl(fixture, 'filter-all').nativeElement.classList.contains('active')
    ).toBeFalsy()
    expect(
      findEl(fixture, 'filter-rising').nativeElement.classList.contains(
        'active'
      )
    ).toBeTruthy()
  })
})
