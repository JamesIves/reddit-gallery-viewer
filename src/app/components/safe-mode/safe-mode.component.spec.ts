import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeModeComponent } from './safe-mode.component';

describe('SafeModeComponent', () => {
  let component: SafeModeComponent;
  let fixture: ComponentFixture<SafeModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SafeModeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SafeModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
