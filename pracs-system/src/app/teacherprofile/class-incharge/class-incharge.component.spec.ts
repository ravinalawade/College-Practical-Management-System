import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassInchargeComponent } from './class-incharge.component';

describe('ClassInchargeComponent', () => {
  let component: ClassInchargeComponent;
  let fixture: ComponentFixture<ClassInchargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassInchargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassInchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
