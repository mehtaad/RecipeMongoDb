import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcuteComponent } from './excute.component';

describe('ExcuteComponent', () => {
  let component: ExcuteComponent;
  let fixture: ComponentFixture<ExcuteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcuteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
