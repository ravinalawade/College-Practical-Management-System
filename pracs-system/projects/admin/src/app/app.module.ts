import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ModuleWithProviders } from '@angular/compiler/src/core';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { StudentComponent } from './student/student.component';
import { TeacherComponent } from './teacher/teacher.component';
import { TimetableComponent } from './timetable/timetable.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    StudentComponent,
    TeacherComponent,
    TimetableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

@NgModule({})
export class AdminSharedModule{
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppModule,
      providers: []
    }
  }
}

