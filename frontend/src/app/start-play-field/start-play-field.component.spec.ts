import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartPlayFieldComponent } from './start-play-field.component';

describe('StartPlayFieldComponent', () => {
  let component: StartPlayFieldComponent;
  let fixture: ComponentFixture<StartPlayFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartPlayFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartPlayFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
