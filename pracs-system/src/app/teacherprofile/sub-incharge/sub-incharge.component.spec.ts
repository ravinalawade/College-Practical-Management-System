import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubInchargeComponent } from './sub-incharge.component';

describe('SubInchargeComponent', () => {
  let component: SubInchargeComponent;
  let fixture: ComponentFixture<SubInchargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubInchargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubInchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
