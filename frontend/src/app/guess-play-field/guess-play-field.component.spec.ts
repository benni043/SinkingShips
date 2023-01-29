import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessPlayFieldComponent } from './guess-play-field.component';

describe('GuessPlayFieldComponent', () => {
  let component: GuessPlayFieldComponent;
  let fixture: ComponentFixture<GuessPlayFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuessPlayFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuessPlayFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
