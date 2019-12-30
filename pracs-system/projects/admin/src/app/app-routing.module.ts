import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { StudentComponent } from './student/student.component';
import { TeacherComponent } from './teacher/teacher.component';
import { TimetableComponent } from './timetable/timetable.component';


const routes: Routes = [
  { path: 'admin', redirectTo: 'admin/nav'},
  { path: 'admin/nav', component: NavigationComponent},
  { path: 'admin/student', component: StudentComponent},
  { path: 'admin/teacher', component: TeacherComponent},
  { path: 'admin/timetable', component: TimetableComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { enableTracing: true } // <-- debugging purposes only
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
