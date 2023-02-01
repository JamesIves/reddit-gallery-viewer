import {ComponentFixture, TestBed} from '@angular/core/testing'
import {findEl} from 'src/app/util/spec'

import {NavbarComponent} from './navbar.component'

describe('NavbarComponent', () => {
  let component: NavbarComponent
  let fixture: ComponentFixture<NavbarComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(NavbarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('renders a link', () => {
    expect(findEl(fixture, 'navbar-link')).toBeTruthy()
  })
})
