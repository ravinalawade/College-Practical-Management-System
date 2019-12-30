import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherprofileComponent } from './teacherprofile.component';

describe('TeacherprofileComponent', () => {
  let component: TeacherprofileComponent;
  let fixture: ComponentFixture<TeacherprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
